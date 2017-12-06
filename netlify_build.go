package main

import (
	"bytes"
	"fmt"
	"io/ioutil"
	"os"
	"path/filepath"
	"strings"

	"github.com/kjk/u"
)

var (
	netlifyRedirects []*netlifyRedirect
)

var (
	redirects = map[string]string{
		"/docs/":                             "/docs/SumatraPDF-documentation-fed36a5624d443fe9f7be0e410ecd715.html",
		"/":                                  "/free-pdf-reader.html",
		"/index.html":                        "/free-pdf-reader.html",
		"/index.php":                         "/free-pdf-reader.html",
		"/index.htm":                         "/free-pdf-reader.html",
		"/home.php":                          "/free-pdf-reader.html",
		"/free-pdf-reader.html:":             "/free-pdf-reader.html",
		"/free-pdf-reader-ja.htmlPDF":        "/free-pdf-reader.html",
		"/free-pdf-reader-ru.html/":          "/free-pdf-reader.html",
		"/sumatrapdf":                        "/free-pdf-reader.html",
		"/download.html":                     "/download-free-pdf-viewer.html",
		"/download-free-pdf-viewer-es.html,": "/download-free-pdf-viewer.html",
		"/translators.html":                  "https://github.com/sumatrapdfreader/sumatrapdf/blob/master/TRANSLATORS",
		"/develop.html/":                     "/docs/Join-the-project-as-a-developer-be6ef085e89f49038c2b671c0743b690.html",
		"/develop.html":                      "/docs/Join-the-project-as-a-developer-be6ef085e89f49038c2b671c0743b690.html",
		"/forum.html":                        "https://forum.sumatrapdfreader.org/",
	}
)

type netlifyRedirect struct {
	from string
	to   string
	// valid code is 301, 302, 200, 404
	code int
}

func netlifyAddRedirect(from, to string, code int) {
	r := netlifyRedirect{
		from: from,
		to:   to,
		code: code,
	}
	netlifyRedirects = append(netlifyRedirects, &r)
}

func netlifyAddRewrite(from, to string) {
	netlifyAddRedirect(from, to, 200)
}

func netflifyAddTempRedirect(from, to string) {
	netlifyAddRedirect(from, to, 302)
}

func netflifyAddPermRedirect(from, to string) {
	netlifyAddRedirect(from, to, 301)
}

func netlifyAddStaticRedirects() {
	for from, to := range redirects {
		netflifyAddTempRedirect(from, to)
	}
}

func mkdirForFile(filePath string) error {
	dir := filepath.Dir(filePath)
	return os.MkdirAll(dir, 0755)
}

func netlifyPath(fileName string) string {
	fileName = strings.TrimLeft(fileName, "/")
	path := filepath.Join("netlify_static", "www", fileName)
	err := mkdirForFile(path)
	u.PanicIfErr(err)
	return path
}

func netlifyWriteFile(fileName string, d []byte) {
	path := netlifyPath(fileName)
	fmt.Printf("%s\n", path)
	ioutil.WriteFile(path, d, 0644)
}

func netlifyWriteRedirects() {
	var buf bytes.Buffer
	for _, r := range netlifyRedirects {
		s := fmt.Sprintf("%s\t%s\t%d\n", r.from, r.to, r.code)
		buf.WriteString(s)
	}
	netlifyWriteFile("_redirects", buf.Bytes())
}

func netlifyBuild() {
	// TODO: implement me
	netlifyAddStaticRedirects()
}
