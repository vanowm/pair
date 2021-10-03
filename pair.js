"use strict"

!(function()
{
/*
const cards = [..."🂡🂮🂭🂫🂪🂩🂨🂧🂦🂥🂤🂣🂢🃑🃞🃝🃛🃚🃙🃘🃗🃖🃕🃔🃓🃒🂱🂾🂽🂻🂺🂹🂸🂷🂶🂵🂴🂳🂲🃁🃎🃍🃋🃊🃉🃈🃇🃆🃅🃄🃃🃂"];
const cardInfo = (e =>
{
  const data = {
    type: ["spade", "club", "heart", "diamond"],
    value: ["Ace", "King", "Queen", "Jack", 10, 9 ,8, 7, 6, 5, 4, 3, 2]
  }

  return id => {return {card: cards[id], type: data.type[~~(id/13)], value: data.value[id%13], color: ~~(id/26) ? "red" : "black"}}
})();
*/
const cardsBack = [..."🂠🃡🃢🃣🃤🃥🃦🃧🃨🃩🃪🃫🃬🃭🃮🃯🃰🃱🃲🃳🃴🃵"];
const cards = (e =>
{
  const a = [];
  for(let i = 0x1f0a0; i < 0x1f0df; i++)
  {
    if (i % 16 && (i+1) % 16 && (i+4) % 16)
      a[a.length] = String.fromCodePoint(i);
  }
  const data = {
    cards: a,
    type: ["spade", "heart", "diamond", "club"],
    value: ["Ace", 2,3,4,5,6,7,8,9,10,"Jack","Queen","King"]
  }
  const r = id => {return {card: data.cards[id], type: data.type[~~(id/13)], value: data.value[id%13], color: id>12&&id<39 ? "red" : "black"}};
  r.list = data.cards;
  return r;
})();

const STATS_ID = 0, //indexes in the stored log
      STATS_DATE = 1,
      STATS_TIME = 2,
      STATS_PAIR = 3,
      STATS_STEP = 4,
      STATS_SEQ = 5,
      STATS_DECK = 6,
      STATS_LOG = 7,
      STATS_DUP = 8;

const resultOrder = [STATS_DATE, STATS_PAIR, STATS_TIME, STATS_STEP, STATS_SEQ]; //indexes for the result table
const statusOrder = [STATS_DATE, STATS_TIME, STATS_PAIR, STATS_STEP, STATS_SEQ]; //indexes for the status
const elTable = document.querySelector(".table");
const elCardsPairSlider = document.getElementById("numSlider"); //number of pairs;
const elCardsPairInput = document.getElementById("numInput"); //number of pairs;
const elResult = document.getElementById("result");
const elResultTable = document.querySelector(".result");
const elSort = elResultTable.querySelector("thead > tr");
const elStatus = document.getElementById("status");
const elFilter = document.getElementById("filter");
const elPlayer = document.getElementById("player");
const elAudio = document.getElementById("audio");

/*remove none-existing font characters*/
const el = document.createElement("span");
elTable.appendChild(el);
el.textContent = cardsBack[0];

for(let i = 1, min = el.clientWidth; i < cardsBack.length; i++)
{
  el.textContent = cardsBack[i];
  if (el.clientWidth < min)
  {
    cardsBack.splice(i--, 1);
  }
}
elTable.removeChild(el);


elAudio.checked = ~~(localStorage.getItem("a")||1);

playSound.list = {};
document.querySelectorAll("audio").forEach(e => 
{
  playSound.list[e.title] = e;
});
const SID = (e =>
{
  let r = localStorage.getItem("sid")||"";
  if (!r.match(/[a-zA-Z0-9]{32}/))
    r = _SID;

  if (!r.match(/[a-zA-Z0-9]{32}/))
  {
    const s = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    r = "";
    for(let i = 0; i < 32; i++)
      r += s[~~(Math.random() * s.length)];

  }
  return r;
})();

localStorage.setItem("sid", SID);

//if (readCookie("sid") != SID)
  createCookie("sid", SID);

let cardBack, count, sequence, deck, opened, playback, ID = ~~localStorage.getItem("id") || 1,
    num = ~~localStorage.getItem("n") || 5;

if (num < 2)
  num = 2;
if (num > 1000)
  num = 1000;

elCardsPairInput.value = elCardsPairSlider.value = num;
//merge, unique, sort
const STATS = (()=>
{
  let v;
  try{v=localStorage.getItem("r")}catch(e){}
  const arr = [...new Set(JSON.parse(v || "[]").concat(STATSDATA).map(e => JSON.stringify(e)))].map(e=>JSON.parse(e)).sort((a,b)=>a[0]-b[0]);
/*
  let max = 0, dup = [];
  for(let i = 0, p = null; i < arr.length; i++)
  {
    if (arr[i][STATS_ID] == p)
      dup.push(arr[i]);

    p = arr[i][STATS_ID];

    if (p > max)
      max = p;
  }
  const cache = [];
  if (dup.length)
  {
    for(let i = 0; i < dup.length; i++)
    {
      let d = [...dup[i]].splice(STATS_ID ,1);
      for (let 
      dup[i][STATS_ID] = ++max;
    }
  }
*/
  return arr;//.sort((a,b)=>a[0]-b[0]);
})();
const STATSSORTED = {sort:null,order:null,data:[]};

if (STATS.length)
{
  const i = STATS[STATS.length-1][STATS_ID];
  if (i > ID)
  {
    ID = i + 1;
    localStorage.setItem("id", ID);
  }
}
let sort = ~~localStorage.getItem("s") || 1,
    order = ~~localStorage.getItem("o"),
    filter = ~~localStorage.getItem("f");

function init(data, play)
{
  opened = -1;
 	async();
 	showTimer();
  if (elTable.stats)
  {
    player.stop();
    player.init();
  }

  if (!Array.isArray(data) && data)
  {
    let num = ~~((data.target == elCardsPairSlider) ? elCardsPairSlider.value : elCardsPairInput.value);

    if (num < 2)
      num = 2;
    if (num > 1000)
      num = 1000;

    elCardsPairSlider.value = elCardsPairInput.value = num;
    localStorage.setItem("n", num)
    data = undefined;
  }
  if (data)
  {
    playback = data;
    elCardsPairSlider.value = elCardsPairInput.value = data[STATS_PAIR];
  }
  else
  {
    playback = undefined;
  }
//  if (!elResult.children.length)
  statsShow(playback);

  document.body.classList.toggle("replay", data?true:false);
  document.body.classList.remove("started");
  document.body.classList.remove("solved");
  document.body.classList.remove("playback");
  document.body.classList.remove("play");
  document.body.classList.remove("stop");
  document.body.classList.remove("player");
  document.body.classList.remove("noplay");
  
  const cardsPair = ~~elCardsPairInput.value;
  elCardsPairSlider.title = elCardsPairInput.title = cardsPair;

  statsShowCur();

  count = cardsPair * 2;
  sequence = 0;
  cardBack = shuffle(cardsBack)[0];
  deck = [];
  elTable.stats = {
    deck: deck,
    rec: [],
    recTime: 0,
    cards: cardsPair,
    attempts: 0,
    time: null,
    sequenceMax: 0,
    repeat: false
  }
  
  let div = document.createElement("div");
  div.textContent = cardBack;
  elTable.innerHTML = "";
  for(let i = 0, list = Object.keys(cards.list); i < count; i++)
  {
    if (i < cardsPair)
    {
      deck[i] = ~~list.splice(~~(Math.random() * list.length), 1)[0];
      if (!list.length)
        list = Object.keys(cards.list);
    }
    else
      deck[i] = deck[i-cardsPair];

    elTable.appendChild(div);
    div = div.cloneNode(true);
  }
  deck = shuffle(deck);
  elTable.stats.pow = Math.pow(2, ~~Math.log2(deck.length)+1);

//cheating
/*
deck.forEach((e,i) =>
{
  elTable.children[i].textContent = cards(e).card;
  if (cards(e).color == "red")
    elTable.children[i].classList.add("red");
//    elTable.children[i].classList.add("open");
});
*/
  if (playback)
  {
    
    deck = hex2array(playback[STATS_DECK]) || deck;
    elTable.stats.repeat = true;
    document.body.classList.toggle("playback", true);
    if (playback[STATS_LOG])
    {
      document.body.classList.add("player");
      document.body.classList.add("play");
      document.body.classList.add("stop");
      player.init(playback[STATS_LOG]);
      if (play)
        player.play();
    }
  }
}
elCardsPairInput.addEventListener("input", e =>
{
  clearTimeout(e.target.timer);
  if (~~e.target.value < 2)
  {
    e.target.timer = setTimeout(t=>
    {
      e.target.value = 2;
      init(e);
    }, 500);
  }
  else
  {
    init(e);
  }
});
elCardsPairSlider.addEventListener("input", init);
init();

elTable.addEventListener("click", e => 
{
  if (e.target.parentNode != elTable) //ignore non-card clicks
    return;

  if ((e.isTrusted && (player.isPlaying || player.isPaused)) || (!e.isTrusted && !player.isPlaying))
    return;

  const index = Array.prototype.indexOf.call(e.target.parentNode.children, e.target);

  if (e.target.classList.contains("open")) //ignore opened card clicks
  {
		if (document.body.classList.contains("solved"))
		{
    	async();
   	  init();

    	return;
    }
    if (index === opened || (!e.target.classList.contains("mark") && !e.target.classList.contains("bad")))
		  return;

		opened = -1;
  }
  async();
  if (e.isTrusted)
  {
    player.canPlay = false;
    player.stop(true);

//    document.body.classList.remove("player");
    document.body.classList.add("noplay");
//    document.body.classList.remove("play");
    document.body.classList.remove("playback");
  }
  const date = new Date(),
        time = date - elTable.stats.time;

  if (!elTable.stats.time)
  {
    document.body.classList.add("started");
    elTable.stats.time = date; //start the timer
//    statsShowCur(statsConvertData([e.isTrusted ? elTable.stats.time : undefined, 0, elTable.stats.cards]));
    const data = [];
    if (e.isTrusted)
      data[STATS_DATE] = elTable.stats.time;
    
    data[STATS_TIME] = 0;
    data[STATS_PAIR] = count/2;
    data[STATS_STEP] = 0;
    data[STATS_SEQ] = 0;
    if (e.isTrusted)
      statsShowCur(statsConvertData(data));

    showTimer(53);
    elTable.stats.recTime = date;
  }

  elTable.stats.rec[elTable.stats.rec.length] = (date - elTable.stats.recTime) * elTable.stats.pow + index;
  elTable.stats.recTime = date;
  const info = cards(deck[index]);
	e.target.textContent = info.card;
	e.target.title = info.value + " of " + info.type;
  e.target.classList.toggle("red", info.color == "red");
  e.target.classList.add("open"); //open the card
  e.target.classList.add("mark"); //highlight the card
  playSound("click");
  if (opened < 0)
  {
    opened = index;  //remember firt flipped card
    return;
  }
  //record some stats
  elTable.stats.attempts++;
  sequence++;
  elTable.stats.sequenceMax = Math.max(sequence, elTable.stats.sequenceMax);

  let c = elTable.children[opened]; //because we going to use async callback, we need to store open card in a local variable

  e.target.classList.remove("mark");
  c.classList.remove("mark");
  //does it match previous open card
  if (deck[opened] == deck[index])
  {
    count -= 2; //decreese total number of non open pairs
    if (count)
    {
      playSound("good")
      e.target.classList.add("good");
      c.classList.add("good");
    }
    else
    {
      playSound(elTable.stats.cards == elTable.stats.attempts ? "wow" : "tada");
    }
  }
  else
  {
    playSound("bad")
    //this card does not match
    sequence = 0;
    e.target.classList.add("bad");
    c.classList.add("bad");

    async(s =>
    {
      //close both cards and reset highlight
      e.target.classList.remove("open");
      c.classList.remove("open");
      e.target.classList.remove("red");
      c.classList.remove("red");
      e.target.textContent = cardBack;
      c.textContent = cardBack;
      e.target.title = "";
      c.title = "";
      clear();
    }, 1000);
  }
  
  //are there any pairs left?
  if (!count)
  {
    showTimer();
    statsShowCur();
    //all pairs are opened. game over

    if (e.isTrusted)
    {
      const data = []
      data[STATS_ID] = ID++;
      data[STATS_DATE] = date.getTime();
      data[STATS_TIME] = time;
      data[STATS_PAIR] = elTable.stats.cards;
      data[STATS_STEP] = elTable.stats.attempts;
      data[STATS_SEQ] = elTable.stats.sequenceMax;
      data[STATS_DECK] = deck.reduce((h, a) => (h = typeof(h) == "string" ? h : h.toString(16).padStart(2, "0")) + a.toString(16).padStart(2, "0"));

      data[STATS_LOG] = elTable.stats.rec;
      if (playback)
        data[STATS_DUP] = STATS[STATS.indexOf(playback)][STATS_ID];

      STATS.push(data);
      try{localStorage.setItem("r", JSON.stringify(STATS));}catch(e){};
      localStorage.setItem("id", ID);
      statsShow(-1);
      document.body.classList.remove("replay");
    }
    document.body.classList.add("solved");
//    if (e.isTrusted)
//      async(init, 30000);
  }
  else
  {
//    statsShowCur(statsConvertData([e.isTrusted ? elTable.stats.time : undefined, new Date() - elTable.stats.time, count/2, elTable.stats.attempts, elTable.stats.sequenceMax]));
    const data = [];
    if(e.isTrusted)
      data[STATS_DATE] = elTable.stats.time;

    data[STATS_TIME] = new Date() - elTable.stats.time;
    data[STATS_PAIR] = elTable.stats.cards;
    data[STATS_STEP] = elTable.stats.attempts;
    data[STATS_SEQ] = elTable.stats.sequenceMax;
    
    if (e.isTrusted)
      statsShowCur(statsConvertData(data));
  }
  async(clear, 1000);
  opened = -1;
  function clear()
  {
    e.target.classList.remove("bad");
    c.classList.remove("bad");
    e.target.classList.remove("good");
    c.classList.remove("good");
  }
})

elPlayer.addEventListener("click", e =>
{
  if (!player.canPlay)
    return;

  if (e.target.classList.contains("stop"))
  {
    player.stop(true, true);
  }

  if (document.body.classList.contains("noplay"))
    return;

  if (e.target.classList.contains("play"))
  {
    if (document.body.classList.contains("pause"))
      player.stop();
    else
      player.play();
  }

  if (e.target.classList.contains("pause"))
  {
    player.stop();
  }
});

elFilter.addEventListener("input", e =>
{
  filter = ~~e.target.value;
  localStorage.setItem("f", filter);
  statsShow(playback || -1);
});

elSort.addEventListener("click", e =>
{
  if (e.target.parentNode != elSort)
    return;

  const index = (Array.prototype.indexOf.call(e.target.parentNode.children, e.target) || 1)-1;

  const s = resultOrder[index];
  if (s == sort)
    order = ~~!order;
  else
    sort = s;

  localStorage.setItem("s", sort);
  localStorage.setItem("o", order);
//  statsShow(document.body.classList.contains("solved") ? -1 : undefined);
  statsShow(playback || -1);
});

elResult.addEventListener("dblclick", e =>
{
  const row = e.target.closest("tr");
  init(row._stats);
  e.preventDefault();
});

elAudio.addEventListener("input", e =>
{
  localStorage.setItem("a", ~~e.target.checked);
});

const player = new class player
{
  constructor(data)
  {
    this.elSpeed = document.getElementById("speed");
    this.elSpeedDisp = this.elSpeed.parentNode.querySelector(".disp");

    this.elSpeed.min = 0;
    this.elSpeed.max = 5;
    let speed = localStorage.getItem("p");
    if (speed < this.elSpeed.min || speed > this.elSpeed.max)
      speed = 1;

    this.speed = ~~speed;

    this.elSpeed.value = this.speed;
    this.speedTitle();
    let that = this;
    this.elSpeed.addEventListener("input", e =>
    {
      that.speed = ~~e.target.value;
      that.speedTitle();
      localStorage.setItem("p", that.speed);
    });

    this.init(data);
  }
  init(data)
  {
    this.data = data || [];
    this.position = 0;
    this.timer = null;
    this.time = 0;
    this.timePaused = 0;
    this.pausedDelay = 0;
    this.isPlaying = false;
    this.finished = false;
    this.isPaused = false;
    this.canPlay = this.data.length;
    this.lastStepDelay = 0;
    this.lastStepTime = 0;
    this.pauseDelay = 0;
    
  }
  next()
  {
    try
    {
      elTable.children[this.card].click();
    }
    catch(e){};
    this.time += this.delay;
    this.pauseDelay = 0;
    this.position++;
    if (this.position < this.data.length)
      this.play(true);
    else
      this.stop(true);

    this.pausedDalay = 0;
  }
  get speedConverted()
  {
    return this.speed-1 > 0 ? Math.pow(2, this.speed-1) : (this.speed -1) * 0.5 + 1;
  }
  speedTitle()
  {
    this.elSpeed.title = this.elSpeedDisp.textContent = (this.speed == this.elSpeed.max ? "Max" : "x" + this.speedConverted);
  }
  get card()
  {
    return this.data[this.position] & (elTable.stats.pow-1);
  }
  get delay()
  {
    return ~~(this.data[this.position] / elTable.stats.pow);
  }
  get speedDelay()
  {
    return this.speed == 10 ? 0 : this.delay / this.speedConverted;
  }

  get getTime()
  {
    return this.isPlaying ? (new Date() - this.timeStart) * this.speedConverted : this.isPaused ?  this.timePaused : 0;
  }

  play(d)
  {
    if (this.finished)
      return init(playback, true);

    const date = new Date();
    const delay = d || d === undefined ? this.pauseDelay || this.speedDelay : 0;
    if (!this.isPlaying)
    {
      this.timeStart =  date - this.timePaused  /  this.speedConverted;
    }

    if (!d)
    {
 //     this.timePaused = (date - this.lastStepTime) + this.lastStepDelay;
//      this.timeStart = date - this.timePaused;
    }
    this.isPaused = false;
    this.isPlaying = true;
    document.body.classList.add("pause");


//    if (elTable.stats.time)
//      elTable.stats.time = date - this.time - (!delay ? this.speedDelay : 0);

    this.lastStepTime = date;
    this.lastStepDelay = delay;
    this.timer = setTimeout(this.next.bind(this), delay);
  }

  stop(stop, reload)
  {
    clearTimeout(this.timer);
    this.isPlaying = false;
    this.isPaused = !stop;
    const date = new Date();
    this.timePaused = this.time + ((date - this.lastStepTime) * this.speedConverted);
    this.pauseDelay = this.lastStepDelay - (date - this.lastStepTime) * this.speedConverted;
    if (document.body.classList.contains("playback"))
    {
      document.body.classList.add("play");
      document.body.classList.remove("pause");
      this.canPlay = this.data.length;
    }
    if (stop)
    {
//      document.body.classList.remove("stop");

      this.time = 0;
      this.timePaused = 0;
      this.position = 0;
      this.finished = true;
    }
    if (reload)
      init(playback);
  }
}

function createCookie(n,v){ document.cookie = n+"="+encodeURIComponent(v)+"; path=/; expires="+new Date( (new Date()).getTime()+3153600000000).toGMTString()+";"; }
function readCookie(n,r){return(r=document.cookie.match('(^|;)\\s*'+encodeURIComponent(n)+'\\s*=\\s*([^;]+)'))?r[2]:null}
function hex2array(hex)
{
  if (typeof hex != "string")
    return hex;

  let a =[];
  for(let i = 0; i < hex.length; i++)
    a.push(parseInt(hex[i]+hex[++i], 16))

  return a;
}

function playSound(id)
{
  elAudio.checked && playSound.list[id] && playSound.list[id].play && playSound.list[id].play();
}

function shuffle(arr)
{
  arr = [...arr];
  let m = arr.length, i;
  while (m)
  {
    i = (Math.random() * m--) >>> 0;
    [arr[m], arr[i]] = [arr[i], arr[m]];
  }
  return arr;
}

function statsShowCur(a)
{
  if (!a)
  {
    if (!statsShowCur.templ)
      statsShowCur.templ = "-".repeat(STATS_DUP);

    a = statsShowCur.templ;
  }

  for(let i = 0; i < elStatus.children.length; i++)
    if (a[statusOrder[i]] !== undefined)
      elStatus.children[i].firstElementChild.textContent = a[statusOrder[i]];
}

function showTimer(_speed)
{
  clearInterval(showTimer.timer);
  if (!_speed)
    return;

  showTimer.timer = setInterval(showTime, _speed);
}
function showTime()
{
//  if (player.isPlaying && player.speed != 1)
//    return;

  const data = [];
  data[STATS_TIME] = getTime(player.getTime || (new Date() - elTable.stats.time));
  statsShowCur(data);
}
function getTime(time)
{
  return time > 8553599999 ? "99:59:59.999" : new Date(time).toISOString().replace(/(\d+)T(\d+)/, (a,b,c) => (~~b-1? ("0"+Math.min(((~~b-1)*24+~~c), 99)).substr(-2) : c)).substr(8, 12);
}

function statsSort(s, o)
{
  if (s === undefined)
    s = sort;
  if (o === undefined)
    o = order;

  if (STATSSORTED.sort == s && STATSSORTED.order == o && STATSSORTED.data.length == STATS.length)
    return STATSSORTED.data;

  STATSSORTED.sort = s;
  STATSSORTED.order = o;
  STATSSORTED.length = STATS.length;
  STATSSORTED.data = [...STATS].sort((a,b) => order ? a[sort] - b[sort] : b[sort] - a[sort]);
  return STATSSORTED.data;
}

function statsShow(scroll)
{
  elResult.innerHTML = "";
  const last = STATS[STATS.length-1];
  const filterList = {};
  let latest;
  const sorted = statsSort().filter(s => 
  {
    if (!filterList[s[STATS_PAIR]])
    {
      filterList[s[STATS_PAIR]] = document.createElement("option");
      filterList[s[STATS_PAIR]].value = s[STATS_PAIR];
      filterList[s[STATS_PAIR]].textContent = s[STATS_PAIR];
    }
    return !(filter && filter != s[STATS_PAIR]);
  });
  elResultTable.classList.toggle("odd", sorted.length % 2 ? true : false);
  elResultTable.setAttribute("num", sorted.length);

  sorted.forEach((s, i) => {
    const row = getStatsRow(s);
    row._stats = s;
    if (s === last)
    {
      latest = row;
      row.classList.add("last");
      row.title = "Latest";
    }
    row.firstChild.textContent = i+1;
    elResult.appendChild(row);
  })


  elFilter.innerHTML = '<option value="0">All</option>';
  for(let i = 0, filterKeys = Object.keys(filterList).sort((a,b)=>a-b); i < filterKeys.length; i++)
    elFilter.appendChild(filterList[filterKeys[i]]);

  elFilter.value = filter;
  const col = elSort.querySelector("[sort]");
  if (col)
    col.removeAttribute("sort");

  elSort.children[resultOrder.indexOf(sort)+1].setAttribute("sort", order);
  
  if (scroll === undefined)
    elResultTable.scrollTop = 0;
  else
  {
    const isData = Array.isArray(scroll);
    if (scroll == -1)
      scroll = latest;
    else
      scroll = elResult.children[sorted.indexOf(isData ? scroll : STATS[scroll])];

    if (scroll)
    {
      if (isData)
        scroll.classList.add("replay");

      if (scroll.previousSibling)
        scroll.previousSibling.scrollIntoView();
      else
      {
        scroll = scroll.offsetTop - scroll.offsetHeight;
        if (scroll < 0)
          scroll = 0;

        elResultTable.scrollTop = scroll;
      }
    }
  }
}
function async(callback, time)
{
  if (!async.list)
  {
     async.list = new Map();
  }
  if (!(callback instanceof Function))
  {
    [...async.list].map(a =>
    {
      clearTimeout(a[1].timer);
      a[1].wrapper(callback);
    });
    return;
  }
  const wrapper = param =>
  {
  	async.list.delete(callback);
    callback();
 	}
  const timer = setTimeout(wrapper, time);
  async.list.set(callback, {wrapper, timer});
  return timer;
}

function dateString(a)
{
  return new Date(a-(new Date()).getTimezoneOffset() * 60000).toISOString().replace(/T/g, ' | ').substr(0, 21);
}

function getStatsRow(a)
{
  const row = document.createElement("tr");
  let cell = document.createElement("td");

  if (a[STATS_PAIR] == a[STATS_STEP] && a[STATS_STEP] == a[STATS_SEQ])
  {
    row.classList.add("perfect");
    row.title = "Perfect";
  }
  row.appendChild(cell);
  statsFixOrder(statsConvertData(a)).forEach((a, i) =>
  {
    cell = cell.cloneNode(true);
    cell.textContent = a;
    row.appendChild(cell);
  });
  return row;
}

function statsConvertData(a)
{
  a = [...a];
  if (a[STATS_DATE] !== undefined)
    a[STATS_DATE] = dateString(a[STATS_DATE]);

  if (a[STATS_TIME] !== undefined)
    a[STATS_TIME] = getTime(a[STATS_TIME]);
  return a;
}

function statsFixOrder(a)
{
  if (!a)
    return a;

  const r = [];
  for(let i = 0; i < resultOrder.length; i++)
    r[i] = a[resultOrder[i]];

  return r;
}

})();