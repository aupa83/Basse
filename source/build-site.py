# Construit la version installable (site/index.html) à partir de « Outils basse.html ».
import sys, pathlib
src = pathlib.Path(sys.argv[1]); out = pathlib.Path(sys.argv[2])
s = src.read_text(encoding='utf-8')
head = '''<link rel="manifest" href="manifest.webmanifest">
<meta name="theme-color" content="#0A1217">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Outils basse">
<link rel="apple-touch-icon" href="apple-touch-icon.png">
<link rel="icon" type="image/png" href="icon-192.png">
'''
tail = '''<script>
if('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')){
  window.addEventListener('load', function(){ navigator.serviceWorker.register('sw.js').catch(function(){}); });
}
</script>
'''
assert s.count('</title>') == 1 and s.count('</body>') == 1
s = s.replace('</title>', '</title>\n' + head, 1).replace('</body>', tail + '</body>', 1)
out.write_text(s, encoding='utf-8')
print('ok', out, len(s))
