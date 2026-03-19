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
  const rows = w1.idxOfNon0().map(i => i + 1);
  const cols = w2.idxOfNon0().map(i => i + 1);

  // Helper: get element label (1 on diagonal)
  function n(i, j) {
    return (i >= j) ? "1" : `n_{${i}${j}}`;
  }
  

  // Recursive determinant for general square minor
  function det(R, C) {
    const m = R.length;
    if (m === 2) {
      // 2x2 base case
      return `${n(R[0], C[0])} ${n(R[1], C[1])} - ${n(R[0], C[1])} ${n(R[1], C[0])}`;
    }

    let terms = [];
    for (let j = 0; j < m; j++) {
      // Sign: + - + - ...
      const sign = (j % 2 === 0) ? "" : "-";
      // Remaining rows and columns
      const subR = R.slice(1);
      const subC = C.filter((_, idx) => idx !== j);
      // Recursive call
      const subDet = det(subR, subC);
      terms.push(`${sign}${n(R[0], C[j])}(${subDet})`);
    }
    return terms.join(" + ");
  }

  // Return full LaTeX<
  console.log(det(rows, cols));
  return `\\Delta_{(${w1.weight}),(${w2.weight})} = ${det(rows, cols)}`;
  //return `\\Delta_{(${w1.weight}),(${w2.weight})} = ${normalizePolynomial(det(rows, cols))}`;


  
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

    if (/w\d+/.test(str)) {
    // Split by + signs
    let parts = str.split('+').map(s => s.trim());

    // Start with zero vector
    let arr = new Array(n + 1).fill(0);

    // Add each fundamental weight
    parts.forEach(p => {
      let idx = parseInt(p.replace('w','')) - 1; // wi -> index i-1
      for (let j = 0; j <= idx; j++) {
        arr[j] += 1;
      }
    });
    console.log(arr);
    return new Weight(arr);
  }


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


function normalizePolynomial(polyStr) {
  // Step 1: split into monomials, keeping signs
  let monomials = polyStr.split(/(?=[+-])/).map(s => s.trim());

  // Step 2: helper to get sort key from a factor
  function factorKey(fac) {
    if (fac === "(1)") return [Infinity, Infinity]; // put (1) last
    let match = fac.match(/n_\{(\d+)(\d+)\}/);
    if (match) return [parseInt(match[1]), parseInt(match[2])];
    return [Infinity, Infinity];
  }

  // Step 3: get monomial key
  function monomialKey(mon) {
    // split monomial into factors (assume separated by spaces)
    let factors = mon.replace(/^[+-]\s*/, '').split(/\s+/);
    // use **first factor's key** as main sorting key
    return factorKey(factors[0]);
  }

  // Step 4: sort monomials
  monomials.sort((a, b) => {
    let ka = monomialKey(a);
    let kb = monomialKey(b);
    if (ka[0] !== kb[0]) return ka[0] - kb[0];
    return ka[1] - kb[1];
  });

  // Step 5: return normalized polynomial
  return monomials.join(" ");
}