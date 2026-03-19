// ONLY FOR TYPE A_n

let n = 3;

function setup() {
  createCanvas(200, 200);

  let w1 = new Weight(1);
  let w2 = new Weight(2);

  w2.Print();

  let s2w2 = w2.actByS(2);

  let l = [2, 1, 3, 2];
  let s2132w2 = w2.actByS(l);

  //console.log(Delta(s2w2, s2132w2));

  let w1w3 = new Weight(2, 1, 1, 0);

let w = new Weight(0,0,1,1);
w.Print();
console.log(w.nbOfNon0());

}

function draw() {}

// Returns the minor of N associated to w1, w2
function DeltaLatex(w1, w2) {
  w2.Print();
  console.log(w1.nbOfNon0(), w2.nbOfNon0())

  if (w1.nbOfNon0() === 2 && w2.nbOfNon0() === 2) {
    let l1 = w1.idxOfNon0();
    let l2 = w2.idxOfNon0();

    let a = l1[0] + 1;
    let b = l1[1] + 1;
    let c = l2[0] + 1;
    let d = l2[1] + 1;

      function n(i, j) {
      return (i >= j) ? "" : `n_{${i}${j}}`;
    }

    return `\\Delta_{(${w1.weight}),(${w2.weight})} 
      = ${n(a, c)} ${n(b, d)} - ${n(a, d)} ${n(b, c)}`;
  }

  return "\\text{Only 2x2 minors implemented}";
}

function computeDelta() {
  let w1 = parseWeight(document.getElementById("w1").value);
  let w2 = parseWeight(document.getElementById("w2").value);

  let latex = DeltaLatex(w1, w2);

  let output = document.getElementById("output");
  output.innerHTML = "$$" + latex + "$$";

  MathJax.typesetPromise([output]);
}


function parseWeight(str) {
  str = str.replace(/[()]/g, '');

  let parts = str.split(',');

  let arr = parts.map(x => parseInt(x.trim()));

  while (arr.length < n + 1) {
    arr.push(0);
  }

  return new Weight(arr);
}

///////// HELPERS /////////

function swap(l, i, j) {
  // JS arrays are 0-indexed, but you used 1-indexing → keep behavior
  i = i - 1;
  j = j - 1;

  let temp = l[i];
  l[i] = l[j];
  l[j] = temp;

  return l;
}

function Reverse(l) {
  // clone array
  let list = [...l];

  for (let i = 0; i < list.length; i++) {
    list[i] = l[l.length - i - 1];
  }

  return list;
}