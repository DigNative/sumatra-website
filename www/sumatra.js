// update after releasing a new version
var gSumVer = "3.1.2";

// used by download-prev* pages, update after releasing a new version
var gPrevSumatraVersion = [
	"3.1.1", "3.1", "3.0", "2.5.2", "2.5.1",
	"2.5", "2.4", "2.3.2", "2.3.1", "2.3", "2.2.1", "2.2", "2.1.1",
	"2.1", "2.0.1", "2.0", "1.9", "1.8", "1.7", "1.6",
	"1.5.1", "1.5", "1.4", "1.3", "1.2", "1.1", "1.0.1",
	"1.0", "0.9.4", "0.9.3", "0.9.1", "0.9", "0.8.1",
	"0.8", "0.7", "0.6", "0.5", "0.4", "0.3", "0.2"
];

//var dlPrefix = "//kjkpub.s3.amazonaws.com/sumatrapdf/rel/";
var dlPrefix = "/dl/";

function a(href, txt) {
  return '<a href="' + href + '">' + txt + '</a>';
}

function installerHref(ver) {
  var txt = 'SumatraPDF-' + ver + '-install.exe';
  var url = dlPrefix + txt;
	return a(url, txt);
}

function zipHref(ver) {
  var txt = 'SumatraPDF-' + ver + '.zip';
  var url = dlPrefix + txt;
	return a(url, txt);
}

function installer64Href(ver) {
  var txt = 'SumatraPDF-' + ver + '-64-install.exe';
  var url = dlPrefix + txt;
	return a(url, txt);
}

function zip64Href(ver) {
  var txt = 'SumatraPDF-' + ver + '-64.zip';
  var url = dlPrefix + txt;
	return a(url, txt);
}

var gSumExeName = "SumatraPDF-" + gSumVer + "-install.exe";
var gSumZipName = "SumatraPDF-" + gSumVer + ".zip";
var gSumExeUrl = dlPrefix + gSumExeName;
var gSumZipUrl = dlPrefix + gSumZipName;

var gSumExeName64 = "SumatraPDF-" + gSumVer + "-64-install.exe";
var gSumZipName64 = "SumatraPDF-" + gSumVer + "-64.zip";
var gSumExeUrl64 = dlPrefix + gSumExeName64;
var gSumZipUrl64 = dlPrefix + gSumZipName64;

// used by download-free-pdf-viewer*.html pages
function dlHtml(s1,s2, s3) {
	if (!s3) {
		s3 = "";
	} else {
		s3 = " <span style='font-size:90%; color:gray'>" + s3 + "</span>";
	}
	return '<table><tr><td>' + s1 + '&nbsp;&nbsp;</td><td><a href="' +
	gSumExeUrl + '" onclick="return SetupRedirect()">' + gSumExeName +
	'</a></td></tr><tr><td>' + s2 + '&nbsp;&nbsp;</td><td><a href="' +
	gSumZipUrl + '" onclick="return SetupRedirect()">' + gSumZipName +
	'</a>' + s3 + '</td></tr></table>';
}

function dlHtml64(s1,s2, s3) {
	if (!s3) {
		s3 = "";
	} else {
		s3 = " <span style='font-size:90%; color:gray'>" + s3 + "</span>";
	}
	return '<table><tr><td>' + s1 + '&nbsp;&nbsp;</td><td><a href="' +
	gSumExeUrl64 + '" onclick="return SetupRedirect()">' + gSumExeName64 +
	'</a></td></tr><tr><td>' + s2 + '&nbsp;&nbsp;</td><td><a href="' +
	gSumZipUrl64 + '" onclick="return SetupRedirect()">' + gSumZipName64 +
	'</a>' + s3 + '</td></tr></table>';
}

// used by downloadafter*.html pages
function dlAfterHtml(s1,s2,s3,s4) {
    return '<a href="' + gSumExeUrl + '">' + s1 + '</a>' + s2 +
    '<a href="' + gSumZipUrl + '">' + s3 + '</a>' + s4;
}

function dlAfterHtml64(s1,s2,s3,s4) {
    return '<a href="' + gSumExeUrl64 + '">' + s1 + '</a>' + s2 +
    '<a href="' + gSumZipUrl64 + '">' + s3 + '</a>' + s4;
}

// A heuristic used to detect preferred language of the user
// based on settings in navigator object.
// TODO: we should also look at Accept-Language header, which might look like:
// Accept-Language:ru,en-US;q=0.8,en;q=0.6
// but headers are not available from JavaScript so I would have to
// pass this data somehow from the server to html or use additional
// request from javascript as described at http://stackoverflow.com/questions/1043339/javascript-for-detecting-browser-language-preference
function detectUserLang() {
	var n = window.navigator;
	// a heuristic: userLanguage and browserLanguage are for ie
	// language is for FireFox and Chrome
	var lang1 = n.userLanguage || n.browserLanguage || n.language || "en";
	// we only care about "en" part of languages like "en-US"
	return lang1.substring(0,2);
}


// given /free-pdf-reader.html returns free-pdf-reader
function getBaseUrl() {
	var url = location.pathname.split("/");
	url = url[url.length-1];
	url = url.split(".html")[0];
	return url
}

/*
	Construct html as below, filling the apropriate inter-language links.
	<div id="ddcolortabs">
		<ul>
			<li id="current"><a href="free-pdf-reader.html" title="Home"><span>Home</span></a></li>
			<li><a href="news.html" title="News"><span>News</span></a></li>
			<li><a href="manual.html" title="Manual"><span>Manual</span></a></li>
			<li><a href="download-free-pdf-viewer.html" title="Download"><span>Download</span></a></li>
			<li><a href="forum.html" title="Forums"><span>Forum</span></a></li>
		</ul>
	</div>
	<div id="ddcolortabsline"> </div>
*/
var baseUrls = [
	["free-pdf-reader", "Home"],
	["download-free-pdf-viewer", "Download"],
	["manual", "Manual"],
	["news", "Version History"],
	["forum", "Discussion Forum"]];
function navHtml() {
	var baseUrl = getBaseUrl();

	var s = '<div id="ddcolortabs"><ul>';
	for (var i=0; i<baseUrls.length; i++) {
		var currUrl = baseUrls[i][0];
		if (currUrl == baseUrl) {
			s += '<li id="current">';
		} else {
			s += '<li>';
		}
		var url = currUrl + ".html";
		var txt = baseUrls[i][1];
		s += '<a href="' + url + '" title="' + txt + '"><span>' + txt + '</span></a></li>';
	}
	s += '</ul></div><div id="ddcolortabsline"> </div>';
	return s;
}

function verNewerOrEqThan31(ver) {
		var parts = ver.split(".");
		var major = parseInt(parts[0]);
		if (major > 3) {
			return true;
		}
		if (major < 3 || parts.length < 2) {
			return false;
		}
		var minor = parseInt(parts[1]);
		return minor >= 1;
}

// used by download-prev* pages
function prevDownloadsList() {
	var s = "";
	for (var i=0; i < gPrevSumatraVersion.length; i++)
	{
		var ver = gPrevSumatraVersion[i];
		s += '<p>';
		s += "Installer" + ': ' + installerHref(ver) + '<br>\n';
		s += "Zip file" + ': ' + zipHref(ver);
		if (verNewerOrEqThan31(ver)) {
				s += '<br>' + "Installer" + ' 64-bit: ' + installer64Href(ver) + '<br>\n';
			s += "Zip file" + ' 64-bit: ' + zip64Href(ver);
		}
		s += '</p>\n';
	}
	return s;
}
