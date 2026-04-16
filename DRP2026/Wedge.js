class Wedge {
  constructor(coef, terms) {
    // coef can be Monomial or Polynomial
    if (coef instanceof Monomial) {
      this.coef = new Polynomial(coef);
    } else {
      this.coef = coef; // already a Polynomial
    }

    this.terms = terms.slice(); // copy to avoid aliasing
  }

  // wedge with another Wedge
  wedge(w) {
    // 1) multiply coefficients
    let newCoef = Polynomial.multiplyPoly(this.coef, w.coef);

    // 2) merge terms
    let t = this.terms.concat(w.terms);

    // 3) count inversions for sign
    let inv = 0;
    for (let i = 0; i < t.length; i++) {
      for (let j = i + 1; j < t.length; j++) {
        if (t[i] > t[j]) inv++;
      }
    }

    // apply sign to all monomials in the coefficient
    newCoef.terms.forEach(m => {
      m.sign *= (inv % 2 === 0 ? 1 : -1);
    });

    // 4) sort terms
    t.sort((a, b) => a - b);

    // 5) wedge = 0 if duplicate indices
    for (let i = 0; i < t.length - 1; i++) {
      if (t[i] === t[i + 1]) {
        // zero polynomial
        newCoef = new Polynomial([]);
        break;
      }
    }

    return new Wedge(newCoef, t);
  }

  static wedgeSums(sum1, sum2) {
  let result = [];

  for (let w1 of sum1) {
    for (let w2 of sum2) {
      let wedged = w1.wedge(w2);
      // skip zero wedges
      if (wedged.coef.terms.length > 0) {
        result.push(wedged);
      }
    }
  }

  return result; // array of Wedge
}



// dual wedge eats a sum of wedges
// dual: Wedge (single wedge)
// wedges: Wedge[] (sum of wedges)
// returns: Wedge[] after contraction
static DualActOnSum(dual, wedges) {
  let dualIndices = dual.terms;
  let k = dualIndices.length;
  let result = [];

  for (let w of wedges) {
    // skip wedges of different length
    if (w.terms.length !== k) continue;

    // check sets match
    let sortedDual = dualIndices.slice().sort((a,b)=>a-b);
    let sortedW = w.terms.slice().sort((a,b)=>a-b);

    let match = true;
    for (let i=0; i<k; i++) {
      if (sortedDual[i] !== sortedW[i]) {
        match = false;
        break;
      }
    }
    if (!match) continue; // contraction = 0

    // compute permutation sign
    let perm = w.terms.slice(); // copy
    let sign = 1;
    for (let i=0; i<dualIndices.length; i++) {
      if (dualIndices[i] !== perm[i]) {
        let j = perm.indexOf(dualIndices[i], i);
        [perm[i], perm[j]] = [perm[j], perm[i]];
        sign *= -1;
      }
    }

    // new coefficient = original coef * sign
    let newCoef = w.coef.terms.map(m => {
      return new Monomial(m.a.slice(), m.b.slice(), m.sign * sign);
    });
    let newPoly = new Polynomial(newCoef);

    // new terms = original wedge minus dual indices (empty since lengths match)
    let newTerms = []; // all indices eaten, wedge disappears

    result.push(new Wedge(newPoly, newTerms));
  }

  return result;
}





 static Print(sumOfWedges) {
    if (sumOfWedges.length === 0) {
      console.log("0");
      return;
    }

    let s = sumOfWedges.map(w => {
      if (w.coef.terms.length === 0) return null;
      return w.coef.terms.map(m => m.toStr()).join(" + ") + " " +
             w.terms.map(ti => "e_" + ti + "V").join("");
    }).filter(x => x !== null).join(" + ");

    if (s === "") s = "0";
    console.log(s);
  }

  Print() {
    if (this.coef.terms.length === 0) {
      console.log("0");
      return;
    }
    let s = "(" + this.coef.terms.map(m => m.toStr()).join(" + ") + ") ";
    for (let i = 0; i < this.terms.length; i++) {
      s += "e_" + this.terms[i] + "V";
    }
    console.log(s);
  }

  // latexFormat: takes an array of Wedge objects and returns a LaTeX string
 static latexFormat(wedgeSum) {
  if (wedgeSum.length === 0) return "0";

  // map each wedge to its LaTeX string
  let parts = wedgeSum.map(w => {
    if (w.coef.terms.length === 0) return null; // skip zero coefficient wedges

    // coefficient as LaTeX
    let coefStr = w.coef.latexFormat();

    // wedge part: e_i \wedge e_j ...
    let wedgeStr = w.terms.map(i => `e_{${i}}`).join(" \\wedge ");

    return `${coefStr} ${wedgeStr}`;
  }).filter(x => x !== null);

  if (parts.length === 0) return "0";

  // join with plus signs
  return parts.join(" + ");
}
}