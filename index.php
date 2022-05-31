<?php
session_name("sid");
$sid = @$_COOKIE["sid"];
if (!preg_match("#[a-zA-Z0-9]{32}#", $sid))
{
  $sid = "";
  for($i = 0; $i < 32; $i++)
  {
    do
    {
      $s = random_int(48, 122);
    }
    while(($s > 57 && $s < 65) || ($s > 90 && $s < 97));
    $sid .= chr($s);
  }
}
session_id($sid);
session_start();
$sql = new mysqli("localhost", "pair", "pair", "pair");
if (isset($_POST['id']))
{
  if (isset($_POST['data']))
  {
    $data = @json_encode(@json_decode($_POST['data']));
alert($data);
    if ($data)
    {
//      $result = $sql->query("INSERT INTO data NAMES(sid,data) VALUES('$sid','$data');");
    }
  }
  exit;
}
$result = $sql->query("SELECT data FROM data WHERE sid='" . $sid ."';");

$data = [];
while ($row = $result->fetch_row())
{
  $data[] = $row[0];
}

?>

<!DOCTYPE html>
<html>
<head>
  <meta http-equiv="content-type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pair</title>
	<link rel="stylesheet" media="screen" href="<?=getfile("css/pair.css");?>">
	<script content="text/html; charset=UTF-8">const _SID = "<?=$sid?>";const STATSDATA = [<?=implode(",", $data)?>];
	</script>
</head>
<body>
  <div class="content">
    <div class="control">
      Number of pairs:
      <input id="numSlider" type="range" min="2" max="50" step="1" value="5">
      <input id="numInput" type="number" min="1" max="1000" step="1" value="5">
      <span class="menu">
        <label for="menu" class="menu"><span></span></label>
        <input id="menu" type="checkbox">
        <span class="content">
          <label class="audio"><input id="audio" type="checkbox" checked><span></span></label>
          <span id="player">
              <span class="play"></span>
              <span class="stop"></span>
          </span>
          <span class="speed">
            <div>Speed<span class="disp"></span></div>
            <input id="speed" type="range" min="0" max="10">
          </span>
        </span>
        <label for="menu" class="overlay"></label>
      </span>
    </div>
    <div class="table"></div>
  </div>
  <footer>
    <table class="result">
      <caption>Previous results.<span class="filter"> Show pairs: <select id="filter"></select></span></caption>
      <thead>
        <tr>
          <th></th><th>Date</th><th>Pairs</th><th>Time</th><th>Steps</th><th title="Sequential steps">Seq. steps</th>
        </tr>
      </thead>
      <tbody id="result">
      </tbody>
    </table>
    <div id="status"><span class="startTime">Started:<span></span></span><span>Time:<span></span></span><span>Pairs left:<span></span></span><span>Steps:<span></span></span><span>Seq.steps:<span></span></span></div>
  </footer>
  <audio title="click" src="data:audio/mpeg;base64,SUQzAwAAAAAAPlRTU0UAAAA0AAAATEFNRSA2NGJpdHMgdmVyc2lvbiAzLjk4LjIgKGh0dHA6Ly93d3cubXAzZGV2Lm9yZy8p//tQZAAAAZEJRLUMYAAZYAjVoIwABpxXY7jSgBChBuw3ClACEIAEAe7+hOACCcDAwMW7sMYPg+OB8HwfiQ5+sHAQBAEDn/B8Hw+socLg+8HwfP/+Iw+CADPrE4PjgfB8H4OHP4kOfy7///KO4P/ifAYDAYDAYHA4DA0AAAAFcEw3rEw8gP2FQH6AcoD/IPD4v8gsGBoHbulwXSc+UAgIO+khQkMUKo0CoVCoUCgUCgAAAPwEBGPWxzecj9gIKL3W938cMd+cNP/tOAgUcmIKaP/7UmQAAAFuGVOGGOAAI2IqlcCIAAZVF2wYEoAAjyOtQwBQACSSHG+n7ZwlLbfDSL2iKUIPvhEyFJrb1Y45C+T79S6nDXCU5iCQyziQpb9P/7VgwGDYAkNlKkpKU71ahVm8Lb32ovDbZjf9o5/RwUGWeX9CzP/LzfuT5wQXMj+QxX/7//+x0Eg79/bA4fDgmIjClKyaf8OiwEIJx4cE5Uy0N/8VHhg/q/92/r////+5P/+HBIrmKH/1/4mMUFBxQQU+laf/2E0HkbsalMQU1FAA//tSZAAAAWcFW+4MQAQmYAq5wIgABgj1ThhhAACOnenDAiAATe1jjkjcsFjETCYYAALLuqi1a5RJa3BgGqSyVGAEvidLk9HXd3Dv19Tv6wVX4b/GBP1IACAAwdk3jDiBlYb5SugdiFiouk/Kmnju/1ab7P7163LzQ3JQ+S3rczmKROAP8QLJ5ux1v/2IQ77en1Ocjf+3gAiQISn0/XY9gM58PrcjX8EGnDkf0Z/an1bfqt7fb/kr7/azf/pTfOen6f2xYsDh8Mf/QcQmIKaigAA="></audio>
  <audio title="good" src="data:audio/mpeg;base64,SUQzAwAAAAAAPlRTU0UAAAA0AAAATEFNRSA2NGJpdHMgdmVyc2lvbiAzLjk4LjIgKGh0dHA6Ly93d3cubXAzZGV2Lm9yZy8p//tQxAAAAAABpBQAACKewd8nJ0AAAAAABDDBAAAA8QDGM8ZAAdHiE5t4XQDsfhc2EAACB3/A/L8D2ywGF5//wM2NAxJcDPhwN08A4Db/8BoQIFAw50AJuHLhgf/b4WVhaIBiEQGmDAbIsIVJf//8MTizg9QR4PscYb+LMLX///kwMoRAGxZ8nyCE4aBy5A/////xxg3UBuYPAggHoBfQDGhw2MggGIBA2YD3AMoMACCf////////4b4DYwSyYgpqKZlxycFxkAAAAAAAAAAAAP/7UsQAAAsA32e4GQARdzIoe5FAABBahAKrRaLVYbQKAACOXSUOP6kFLyhMhr8cBu8Dky0dGbIobIqQbWM2UCoRUi6j6JROV1ai4ibm9NJFST7rKjXKZPivhhQ82pZp/8qG54Inzn/////3fh5oVkg0IgCwEBoqSC1aKKO3nVVWalJJJJPSrNWGODGwGtag21EfC4jJ3rr+yK2Wa0lJmrI1+tFG6imk9L+w1QCgANjo4TX///+pP/MjH5///2+Z/+7////ZEukNBYMtMQU1FAAA//tSxAAASsGTO6AOgcFXMmXgHlKADlu+4AAgAADHsFSw4IZem1h/1tMRjgPRuLpsGWXZLSf6n1lVCik5dQopJMq2tMyJL/oG5FADUAds2Nbf6H/+r/qJP1H///OfMT//V///+ipMRgICEVYCD4Afl97jsz6oSFS+tA4e7RIONoBkQxstX9NO/Wp1Xr9jI11sXRWhb/7OagYlmA0iHCXkf+X//9f35mI2blg5//5HH+kMYRL/Uj//nv+p0A5IA6CVHTEFNRTMuOTguMgAAAAAAAD/+1LEAABKPY8pIPKUCXQyJGguUoAAA9AIAD//53tT5lG9IJzqVKUF0BnCo7FIN/R9b1tdbMp1ywzPlIfRp/WgmTAm8DIQw5h52/5BP///yNHW3SLX//lI/4fkSD///+o5/84LsV4QCAWgAgrmb/zKyaKUtlIDpHWAAIPm50aICYgGrRETME2//7IsnU1TRuI+saZa/7oE+BhlgKHSJF1Jv8W////7C7AsCPtkqZ//+ShvuwYTGy+d///qIX/5kMeAw5IimIKaimZccnBcZAAAAP/7UsQAAkqhkR4A9pJJcjJj6C7KUK3/l66j4XOZ6gpsw8FRxI0gCCBywNUzJ4zOM9v///i+KnnRbCr/rQMxjAExBz0kf+dGA3//7dQa8NsLqsxG///5fJPphAHHtD///5CP/6AQhQ+UiQskABQmj0IT9TAAGYQIBnLwry7Kltr/GAZOh2NLABuKYRhhCbWOX///retn2VVGoWvUQNv/TIwCRBTzX/1jj////GNAaVXRK3//j5NumOAbbdf//5wnm/9MPxB5H2TEFNRTMuOTguMg//tSxAADSo2RICH2kIFssmPAztJICDXzvSm+CPjsCgW9UuRPN6XHoYbhpTQkAY56VAFBMXgAyi0vGKC2////jWN/lz/6jMOGHvGqX/WSL////H2H2fmZv//5j1qDiCSb///5F//poiDDi965xSJs7Xtna/FhhycR1hXH8zXA0Dweb74RJn63qRZ5CCh2GpYgBAmAMDVwCRSf////lg///+UwHBVo/+ocpv///RIaFrDcom3//rfnhBYuf///UTj//OjPn2TEFNRTMuOTguMgAAD/+1LEAAAKhZElRPJ0AW8yIoRvUkgEZAABWQAIqq5JaU1UtVQsykiXkRLxCuUFn0Kg0tbaSMgk+8rC0qeYGbZcW1//1JdSvxrEn///GMLSX/yG////UShD36///nX8XpXf///1Gf/6BWWICKsNliUtmziVnaftEtcAm7lQUEahLAGmEAExqFkAmAcAwleBu+wsZ4/97r/Ur/rGsKn//+cDAxXV/5wNSV///6h1A2kj0DX//rI09smXRAzdf//7kkW//lIYDJiCmopmXHJwXGQAAP/7UsQAAglFcyFBdpQBhzIhxF82UAAAgAGtIA///T/kcJnBAyBpwIXwwAbLgMQlJBaKLf/pepVq04tAXXe9ert7ToekLca1dXxn2///+cFK+c//+s91DoJP///6zL8ThA4CB0Vbs+9qo7oynk+klcvkamCyUJRsFkNmAgCAIACjBZCmhuZhdjmGa00kL7epv8FEAnketv/1haSler+oCEU3V/19+oKABYUvIh/3/r5mWc4MsH5P3X+v/rCat/8mj46YgpqKZlxycFxkAAAAAAAA//tSxAACCPFzG0F2lAGeMeGIXzZQAACAAWtACGL//9E/DAxG3iEIBnSBdA4R14gYhiOw+2//+yHR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"></audio>
  <audio title="bad" src="data:audio/mpeg;base64,SUQzAwAAAAAAPlRTU0UAAAA0AAAATEFNRSA2NGJpdHMgdmVyc2lvbiAzLjk4LjIgKGh0dHA6Ly93d3cubXAzZGV2Lm9yZy8p//tQZAAAASgGTL0MYAgaAQkRowABCBSFeblGoBCmCCdDMJAAgelJJIA/ogQQTgAAQPh8QPqOKBBC4P/4P/4IeJw/v6gQ4Y8uHwQ/ezyZPTAGF6YQQwTghLn1g+/If4Y/w/4YwHA4WA4HA4HAoA4AAAC3wBB7wCzoG+f+AuYAxIHRlMRrwV0KoBK/wDYEoDjKH+SJkWmBS/9EvF1Eonf2EU//33vxBbjrOCLl9oVDVlQNoTIqtht4fZE1piKAUCUl2dIEciV4jRfN93+l1SYggP/7UmQAAAGfD9bWJMAEIKIKUMekAAa0S2G4kwAQiIipwx6QAAAAEMY4BAIBAAAAJAOdH0gACchI6AsAx9iDC5KUWQjCJIGI+OiLgbgowKijfKAmAWf6/9bgaBPDpHSLeXhibpTwJSlVeq9pxDk0hPMoKnZtN9GsaoAAAAAAIEKgcEggAAAAkFGA1wkwTrLgYGIMMxEYoTi5wchURnmYtSbMjpryVEUbrHiERtd+pY8TnwYrecCDQxWwCTnuu36ikLgT8IKvPicdNuma3icmV3qA//tSZAAAAZ8RWdYkQAQg4eqgxiQABthRc7gygBCEiCqDGJAAAAAAAkgEEgkEAAAOlYBlYUU2RKoA2j1IikgnBlFvITs8YLleUBB/8McuETJR37TQf/1mliEIQMw+KodoBgOJ0rDyI8Mx5WKkkAqNBiCBvU2pAw6WpAAAAAITEjFo1GA2GAAgrA63QNX1UcRfEivbBwYU98PirlPWhLDHKA4ZuG9CAMEv8WD40k/r+WkISSAIQBJrGDQQly0tGQbAXI55FEIRU0hRfRxicmD9L1j/+1JkAAABkhXWBj3gAiAiCuDEpAAHAG11WDMAEIKJ6wMYkAEwxGxOyElWAyAOgiw4DQC9A1QxxFDncw1AZR7FjIpgEeJOjENYmRkimTFQ2XWv/vwIJRELDBMQAOFxmGiILCARoVA2OnRQomCJIT6zJ/F0Qd5VAAEEH3+122wGAAAFKgFLJ28AcKXnPP/2LAABtt6f/EKetb907jhYQmiYGJ1EnkUIWA4PjxFBr/JHg7JgPvFo7OyocxpFhmmXnLA8wKtPTQMIC78nKsh+rGZMQQ=="></audio>
  <audio title="tada" src="data:audio/mpeg;base64,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"></audio>
  <audio title="wow" src="data:audio/mpeg;base64,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"></audio>
  <script src="<?=getfile("js/pair.js");?>" content="text/html; charset=UTF-8"></script>
<?php
?>
</body>
</html>