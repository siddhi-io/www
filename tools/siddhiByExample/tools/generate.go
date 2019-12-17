package main

import (
	"bytes"
	"crypto/sha1"
	"encoding/json"
	"errors"
	"fmt"
	"github.com/russross/blackfriday"
	"io/ioutil"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"regexp"
	"strings"
	"text/template"
)

var cacheDir = filepath.FromSlash("/tmp/gobyexample-cache")
var pygmentizeBin = filepath.FromSlash("tools/siddhiByExample/vendor/pygments/pygmentize")
var githubsiddhiByExampleBaseURL = "https://github.com/siddhi-io/www/tree/" + os.Args[3] + "/en/siddhi-examples"
var examplesDir = os.Args[1]
var siteDir = os.Args[2]
var dirPathWordSeparator = "-"
var filePathWordSeparator = "_"
var consoleOutputExtn = ".out"
var siddhiFileExtn = ".siddhi"
var protoFilePathExtn = ".proto"
var yamlFileExtn = ".yaml"
var descriptionFileExtn = ".description"
var serverOutputPrefix = ".server"
var clientOutputPrefix = ".client"

var descFileContent = ""
var completeCode = ""
var ignoreSegment = false

func check(err error) {
	if err != nil {
		panic(err)
	}
}

func ensureDir(dir string) {
	err := os.MkdirAll(dir, 0755)
	check(err)
}

func copyFile(src, dst string) {
	dat, err := ioutil.ReadFile(src)
	check(err)
	err = ioutil.WriteFile(dst, dat, 0644)
	check(err)
}

func pipe(bin string, arg []string, src string) []byte {
	cmd := exec.Command(bin, arg...)
	in, err := cmd.StdinPipe()
	check(err)
	out, err := cmd.StdoutPipe()
	check(err)
	err = cmd.Start()
	check(err)
	_, err = in.Write([]byte(src))
	check(err)
	err = in.Close()
	check(err)
	bytes, err := ioutil.ReadAll(out)
	check(err)
	err = cmd.Wait()
	check(err)
	return bytes
}

func sha1Sum(s string) string {
	h := sha1.New()
	h.Write([]byte(s))
	b := h.Sum(nil)
	return fmt.Sprintf("%x", b)
}

func mustReadFile(path string) string {
	bytes, err := ioutil.ReadFile(path)
	check(err)
	return string(bytes)
}

func cachedPygmentize(lex string, src string) string {
	ensureDir(cacheDir)
	arg := []string{"-l", lex, "-f", "html"}
	cachePath := cacheDir + "/pygmentize-" + strings.Join(arg, "-") + "-" + sha1Sum(src)
	cacheBytes, cacheErr := ioutil.ReadFile(cachePath)
	if cacheErr == nil {
		return string(cacheBytes)
	}
	renderBytes := pipe(pygmentizeBin, arg, src)
	// Newer versions of Pygments add silly empty spans.
	renderCleanString := strings.Replace(string(renderBytes), "<span></span>", "", -1)
	writeErr := ioutil.WriteFile(cachePath, []byte(renderCleanString), 0600)
	check(writeErr)
	return renderCleanString
}

func markdown(src string) string {
	return string(blackfriday.MarkdownCommon([]byte(src)))
}

func readLines(path string) []string {
	src := mustReadFile(path)
	return strings.Split(src, "\n")
}

func mustGlob(glob string) []string {
	paths, err := filepath.Glob(glob)
	check(err)
	return paths
}

func whichLexer(path string) string {
	if strings.HasSuffix(path, ".go") {
		return "go"
		//} else if strings.HasSuffix(path, ".client.sh") {
		//    return "client"
		//} else if strings.HasSuffix(path, ".server.sh") {
		//    return "server"
	} else if strings.HasSuffix(path, consoleOutputExtn) {
		return "console"
	} else if strings.HasSuffix(path, siddhiFileExtn) {
		return "siddhi"
	} else if strings.HasSuffix(path, protoFilePathExtn) {
		return "siddhi"
	} else if strings.HasSuffix(path, yamlFileExtn) {
		return "yaml"
	} else if strings.HasSuffix(path, descriptionFileExtn) {
		return "description"
	}
	panic("No lexer for " + path)
	return ""
}

func debug(msg string) {
	if os.Getenv("DEBUG") == "1" {
		fmt.Fprintln(os.Stderr, msg)
	}
}

var docsPat = regexp.MustCompile("^\\s*(\\-\\-|@\\s*Description\\s*\\{\\s*value\\s*:\\s*\\\")")
var docsEndPat = regexp.MustCompile("\\s*\\\"\\s*\\}\\s*")
var dashPat = regexp.MustCompile("\\-+")

type Seg struct {
	Docs, DocsRendered                                         string
	Code, CodeRendered                                         string
	CodeEmpty, CodeLeading, CodeRun, IsConsoleOutput, DocEmpty bool
}

type Example struct {
	Id, Name                    string
	GoCode, GoCodeHash, UrlHash string
	Segs                        [][]*Seg
	Descs                       string
	NextExample                 *Example
	PrevExample                 *Example
	FullCode                    string
	GithubLink                  string
	InputOutput                 string
}

type BBEMeta struct {
	Name string `json:"name"`
	Url  string `json:"url"`
}

type BBECategory struct {
	Title   string    `json:"title"`
	Column  int       `json:"column"`
	Samples []BBEMeta `json:"samples"`
}

func getBBECategories() []BBECategory {
	allBBEsFile := examplesDir + "/all-sbes.json"
	rawCategories, err := ioutil.ReadFile(allBBEsFile)
	if err != nil {
		fmt.Fprintln(os.Stderr, "[ERROR] An error occured while processing : "+allBBEsFile, err)
		os.Exit(1)
	}

	var categories []BBECategory
	json.Unmarshal(rawCategories, &categories)
	return categories
}

func parseHashFile(sourcePath string) (string, string) {
	lines := readLines(sourcePath)
	return lines[0], lines[1]
}

func resetUrlHashFile(codehash, code, sourcePath string) string {
	payload := strings.NewReader(code)
	resp, err := http.Post("https://play.golang.org/share", "text/plain", payload)
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)
	urlkey := string(body)
	data := fmt.Sprintf("%s\n%s\n", codehash, urlkey)
	ioutil.WriteFile(sourcePath, []byte(data), 0644)
	return urlkey
}

func parseSegs(sourcePath string) ([]*Seg, string) {
	lines := readLines(sourcePath)

	filecontent := strings.Join(lines, "\n")
	segs := []*Seg{}
	lastSeen := ""
	isLastSeenEmpty := false
	for _, line := range lines {
		if line == "" {
			if !isLastSeenEmpty {
				lastSeen = ""
				isLastSeenEmpty = true
				continue
			}
		} else {
			isLastSeenEmpty = false
		}

		if len(line) > 64 && !strings.HasPrefix(line, "--") {
			fmt.Fprintln(os.Stderr, "Character length is more than 64. Line : "+line)
		}

		matchDocs := docsPat.MatchString(line)
		matchCode := !matchDocs
		newDocs := (lastSeen == "" && !isLastSeenEmpty) || (lastSeen != "docs")
		newCode := (lastSeen == "" && !isLastSeenEmpty) || ((lastSeen != "code") && ((segs[len(segs)-1].Code != "") && !isLastSeenEmpty))
		if newDocs || newCode {
			debug("NEWSEG")
		}
		if matchDocs {
			trimmed := docsPat.ReplaceAllString(line, "")
			trimmed = docsEndPat.ReplaceAllString(trimmed, "")

			if newDocs {
				newSeg := Seg{Docs: trimmed, Code: ""}
				segs = append(segs, &newSeg)
			} else {
				segs[len(segs)-1].Docs = segs[len(segs)-1].Docs + "\n" + trimmed
			}
			debug("DOCS: " + line)
			lastSeen = "docs"
		} else if matchCode {
			if strings.HasPrefix(line, "import ballerina.doc;") {
				lastSeen = "code"
				continue
			}
			if newCode {
				newSeg := Seg{Docs: "", Code: line}
				segs = append(segs, &newSeg)

			} else {
				segs[len(segs)-1].Code = segs[len(segs)-1].Code + "\n" + line
			}
			debug("CODE: " + line)
			if line != "" {
				lastSeen = "code"
			}
		}
	}
	for i, seg := range segs {
		seg.CodeEmpty = (seg.Code == "")
		seg.DocEmpty = (seg.Docs == "")
		seg.CodeLeading = (i < (len(segs) - 1))
		seg.CodeRun = strings.Contains(seg.Code, "package main")
		seg.IsConsoleOutput = strings.HasSuffix(sourcePath, consoleOutputExtn)
	}
	if strings.HasSuffix(sourcePath, siddhiFileExtn) || strings.HasSuffix(sourcePath, protoFilePathExtn) || strings.HasSuffix(sourcePath, yamlFileExtn) {
		//segs[0].Docs = descFileContent
		descFileContent = ""
	}
	return segs, filecontent
}

func parseAndRenderSegs(sourcePath string) ([]*Seg, string, string) {
	lexer := whichLexer(sourcePath)
	if lexer == "console" || lexer == "description" {
		segs := []*Seg{}
		lines := readLines(sourcePath)
		filecontent := strings.Join(lines, "\n")
		newSeg := Seg{Docs: filecontent}
		segs = append(segs, &newSeg)
		return segs, "", ""
	}
	segs, filecontent := parseSegs(sourcePath)
	ignoreSegment = false
	completeCode = ""

	for _, seg := range segs {
		if seg.Docs != "" {
			seg.DocsRendered = markdown(seg.Docs)
		}

		if seg.Code != "" && lexer != "console" && lexer != "description" {
			var matchOpenSpan = regexp.MustCompile("<span(?: [^>]*)?>")
			var matchCloseSpan = regexp.MustCompile("</span>")
			var matchOpenPre = regexp.MustCompile("<pre>")
			var matchClosePre = regexp.MustCompile("</pre>")
			var matchCodeNextLine = regexp.MustCompile("\n</code></pre></div>")
			var codeCssClass = "siddhi"

			if seg.IsConsoleOutput {
				codeCssClass = "shell-session"
			}

			if lexer == "yaml" {
				codeCssClass = "yaml"
			}

			openSpanCleanedString := matchOpenSpan.ReplaceAllString(cachedPygmentize(lexer, seg.Code), "")
			closeSpanCleanedString := matchCloseSpan.ReplaceAllString(openSpanCleanedString, "")
			openWrapString := matchOpenPre.ReplaceAllString(closeSpanCleanedString, "<pre><code class="+codeCssClass+">")
			closeWrapString := matchClosePre.ReplaceAllString(openWrapString, "</code></pre>")

			if !strings.HasSuffix(seg.Code, "\n") {
				closeWrapString = matchCodeNextLine.ReplaceAllString(closeWrapString, "</code></pre></div>")
			}

			seg.CodeRendered = closeWrapString

			if !ignoreSegment {
				if !strings.Contains(seg.Code, "$ ") {
					if completeCode != "" {
						completeCode = completeCode + "\n"
					}

					if seg.Docs != "" && strings.HasPrefix(seg.Code, "\n") {
						completeCode = completeCode + strings.TrimPrefix(seg.Code, "\n")
					} else {
						completeCode = completeCode + seg.Code
					}
				} else {
					ignoreSegment = true
				}
			}
		}
	}

	if lexer != "go" || lexer != "siddhi" || lexer != "yaml" {
		filecontent = ""
	}
	return segs, filecontent, completeCode
}

func parseExamples(categories []BBECategory) []*Example {
	examples := make([]*Example, 0)
	for _, category := range categories {
		samples := category.Samples
		fmt.Println("Processing SBE Category : " + category.Title)
		for _, bbeMeta := range samples {
			exampleName := bbeMeta.Name
			exampleId := strings.ToLower(bbeMeta.Url)
			if len(exampleId) == 0 {
				fmt.Fprintln(os.Stderr, "\t[WARN] Skipping sbe : "+exampleName+". Folder path is not defined")
				continue
			}
			exampleId = strings.Replace(exampleId, " ", dirPathWordSeparator, -1)
			exampleId = strings.Replace(exampleId, "/", dirPathWordSeparator, -1)
			exampleId = strings.Replace(exampleId, "'", "", -1)
			exampleId = dashPat.ReplaceAllString(exampleId, dirPathWordSeparator)
			exampleBaseFilePattern := strings.Replace(exampleId, dirPathWordSeparator, filePathWordSeparator, -1)
			fmt.Println("\tprocessing sbe: " + exampleName)
			example := Example{Name: exampleName}
			example.Id = exampleId
			example.Segs = make([][]*Seg, 0)
			sourcePaths := mustGlob(examplesDir + "/" + exampleId + "/*")

			// Re-arranging the order of files
			rearrangedPaths := make([]string, 0)
			fileDirPath := examplesDir + "/" + exampleId + "/"

			if !isFileExist(fileDirPath) {
				fmt.Fprintln(os.Stderr, "\t[WARN] Skipping sbe : "+exampleName+". "+fileDirPath+" is not found")
				continue
			}

			descFilePath := fileDirPath + exampleBaseFilePattern + descriptionFileExtn
			if !isFileExist(descFilePath) {
				fmt.Fprintln(os.Stderr, "\t[WARN] Skipping sbe : "+exampleName+". "+descFilePath+" is not found")
				continue
			}

			siddhiFiles := getAllSiddhiFiles(fileDirPath)
			if len(siddhiFiles) == 0 {
				fmt.Fprintln(os.Stderr, "\t[WARN] Skipping sbe : "+exampleName+". No *.siddhi files are found")
				continue
			}

			rearrangedPaths = appendFilePath(rearrangedPaths, descFilePath)
			for _, siddhiFilePath := range siddhiFiles {
				var extension = filepath.Ext(siddhiFilePath)
				var currentSample = siddhiFilePath[0 : len(siddhiFilePath)-len(extension)]
				rearrangedPaths = appendFilePath(rearrangedPaths, siddhiFilePath)

				consoleOutputFilePath := currentSample + consoleOutputExtn
				serverOutputFilePath := currentSample + serverOutputPrefix + consoleOutputExtn
				clientOutputFilePath := currentSample + clientOutputPrefix + consoleOutputExtn

				if isFileExist(consoleOutputFilePath) {
					rearrangedPaths = append(rearrangedPaths, consoleOutputFilePath)
				} else {
					var hasOutput = false
					if isFileExist(serverOutputFilePath) {
						rearrangedPaths = appendFilePath(rearrangedPaths, serverOutputFilePath)
						hasOutput = true
					}
					if isFileExist(clientOutputFilePath) {
						rearrangedPaths = appendFilePath(rearrangedPaths, clientOutputFilePath)
						hasOutput = true
					}

					if !hasOutput {
						fmt.Fprintln(os.Stderr, "\t[WARN] No console output file found for : "+siddhiFilePath)
					}
				}
			}
			sourcePaths = rearrangedPaths
			updatedExamplesList, pErr := prepareExample(sourcePaths, example, examples)
			if pErr != nil {
				fmt.Fprintln(os.Stderr, "\t[WARN] Unexpected error occured while parsing. Skipping sbe : "+example.Name, pErr)
				continue
			}
			examples = updatedExamplesList
		}
	}

	for i, example := range examples {
		if i < (len(examples) - 1) {
			example.NextExample = examples[i+1]
		}
	}

	for i, example := range examples {
		if i != 0 {
			example.PrevExample = examples[i-1]
		}
	}

	return examples
}

func getAllSiddhiFiles(sourceDir string) []string {
	var files []string
	filepath.Walk(sourceDir, func(path string, f os.FileInfo, _ error) error {
		if !f.IsDir() {
			if filepath.Ext(path) == siddhiFileExtn || filepath.Ext(path) == protoFilePathExtn || filepath.Ext(path) == yamlFileExtn {
				// avoiding sub dirs
				if filepath.FromSlash(sourceDir+f.Name()) == filepath.FromSlash(path) {
					files = append(files, sourceDir+f.Name())
				}

			}
		}
		return nil
	})
	return files
}

func prepareExample(sourcePaths []string, example Example, currentExamplesList []*Example) (updatedExamplesList []*Example, err error) {
	defer func() {
		if r := recover(); r != nil {
			fmt.Fprintln(os.Stderr, "An error occured while processing sbe : "+example.Name)
			// find out exactly what the error was and set err
			switch x := r.(type) {
			case string:
				err = errors.New(x)
			case error:
				err = x
			default:
				err = errors.New("Unknown panic")
			}
			// invalidate rep
			updatedExamplesList = nil
			// return the modified err and rep
		}
	}()
	for _, sourcePath := range sourcePaths {

		if strings.HasSuffix(sourcePath, ".hash") {
			example.GoCodeHash, example.UrlHash = parseHashFile(sourcePath)
		} else {
			sourceSegs, filecontents, fullcode := parseAndRenderSegs(sourcePath)
			if filecontents != "" {
				example.GoCode = filecontents
			}

			// We do this since the ".description" file is not read first. If it is the first file in the
			// directory, it will be read first. then we don't need this check.What we do
			if strings.HasSuffix(sourcePath, descriptionFileExtn) {
				descFileContent = sourceSegs[0].Docs
				example.Descs = markdown(descFileContent)
			} else if strings.HasSuffix(sourcePath, consoleOutputExtn) {
				descFileContent = sourceSegs[0].Docs
				example.InputOutput = markdown(descFileContent)
			} else {
				example.Segs = append(example.Segs, sourceSegs)
			}
			example.FullCode = example.FullCode + fullcode

		}
	}
	example.FullCode = cachedPygmentize("siddhi", example.FullCode)
	newCodeHash := sha1Sum(example.GoCode)
	if example.GoCodeHash != newCodeHash {
		example.UrlHash = resetUrlHashFile(newCodeHash, example.GoCode, "examples/"+example.Id+"/"+example.Id+".hash")
	}
	example.GithubLink = githubsiddhiByExampleBaseURL + "/examples/" + example.Id + "/"
	currentExamplesList = append(currentExamplesList, &example)
	return currentExamplesList, nil
}

func renderExamples(examples []*Example) {
	exampleTmpl := template.New("example")
	_, err := exampleTmpl.Parse(mustReadFile("tools/siddhiByExample/templates/example.tmpl"))
	check(err)

	var exampleItem bytes.Buffer
	var renderedBBEs = []string{}
	for _, example := range examples {
		exampleF, err := os.Create(siteDir + "/" + example.Id + ".md")
		exampleItem.WriteString(example.Id)
		check(err)
		exampleTmpl.Execute(exampleF, example)
		renderedBBEs = append(renderedBBEs, example.Id)
	}
	generateJSON(renderedBBEs)
}

func generateJSON(renderedBBEs []string) {
	urlsJson, _ := json.Marshal(renderedBBEs)
	builtBBEsFile := siteDir + "/built-sbes.json"
	fmt.Println("Creating a json file of successful BBEs in : " + builtBBEsFile)
	err := ioutil.WriteFile(builtBBEsFile, urlsJson, 0644)
	check(err)

}

func appendFilePath(filePaths []string, filePath string) []string {
	if isFileExist(filePath) {
		filePaths = append(filePaths, filePath)
	} else {
		fmt.Fprintln(os.Stderr, filePath+" is not available")
		os.Exit(1)
	}
	return filePaths
}

// Check whether the file exists.
func isFileExist(path string) bool {
	if _, err := os.Stat(path); err != nil {
		if os.IsNotExist(err) {
			return false
		} else {
			fmt.Fprintln(os.Stderr, fmt.Sprintf("unable to read file '%v'", path), err.Error())
			os.Exit(1)
		}
	}
	return true
}

type Sample struct {
	Name string `json:"name"`
	Url  string `json:"url"`
}

type SampleGroup struct {
	Title    string   `json:"title"`
	Type     int      `json:"column"`
	Category string   `json:"category"`
	Samples  []Sample `json:"samples"`
}

func buildExampleIndexPage(jsonPath string, mkdocsYamlPath string) {
	// Create index for generated samples
	jsonFile, jsonErr := ioutil.ReadFile(jsonPath)
	yamlFile, yamlErr := ioutil.ReadFile(mkdocsYamlPath)

	check(jsonErr)
	check(yamlErr)
	var sampleGroups []SampleGroup
	json.Unmarshal(jsonFile, &sampleGroups)

	var sampleGroupPrefix = "      - "
	var samplePrefix = "        - "
	var exampleString strings.Builder

	exampleString.WriteString("    - Examples:\n")
	exampleString.WriteString(sampleGroupPrefix)
	exampleString.WriteString("Overview: docs/examples/index.md")
	exampleString.WriteString("\n")
	for i := 0; i < len(sampleGroups); i++ {
		exampleString.WriteString(sampleGroupPrefix)
		exampleString.WriteString(sampleGroups[i].Title)
		exampleString.WriteString(":\n")
		for j := 0; j < len(sampleGroups[i].Samples); j++ {
			exampleString.WriteString(samplePrefix)
			exampleString.WriteString(sampleGroups[i].Samples[j].Name)
			exampleString.WriteString(": docs/examples/")
			exampleString.WriteString(sampleGroups[i].Samples[j].Url)
			exampleString.WriteString(".md\n")
		}
	}
	newContents := strings.Replace(string(yamlFile), "    #Examples:", exampleString.String(), -1)
	fmt.Println(exampleString.String())
	fmt.Println(newContents)
	err := ioutil.WriteFile(mkdocsYamlPath, []byte(newContents), 0)
	if err != nil {
		panic(err)
	}
}

func main() {
	copyFile( examplesDir + "/all-sbes.json", siteDir+"/all-sbes.json")
	bbeCategories := getBBECategories()
	examples := parseExamples(bbeCategories)
	renderExamples(examples)
	buildExampleIndexPage(examplesDir + "/all-sbes.json", "en/mkdocs.yml")
}
