// =======================
// Weight CLASS (PORTED)
// =======================

class Weight {
  constructor(...args) {
    this.weight = new Array(n + 1).fill(0);

    // Case 1: Weight([array])
    if (args.length === 1 && Array.isArray(args[0])) {
      this.weight = [...args[0]];
    }

    // Case 2: Weight(i) → fundamental weight
    else if (args.length === 1 && typeof args[0] === "number") {
      let i = args[0];
      for (let j = 0; j < this.weight.length; j++) {
        this.weight[j] = (j < i) ? 1 : 0;
      }
    }

    // Case 3: Weight(a,b,c,d)
    else {
      this.weight = [...args];
    }
  }

  Add(w) {
    let newW = new Array(n + 1);
    for (let i = 0; i < n + 1; i++) {
      newW[i] = w.weight[i] + this.weight[i];
    }
    return new Weight(newW);
  }

  actByS(i) {
    let list = [...this.weight];
    list = swap(list, i, i + 1);
    return new Weight(list);
  }

  actBySArray(l) {
    l = Reverse(l);
    let list = [...this.weight];

    for (let i = 0; i < l.length; i++) {
      let idx = l[i];
      list = swap(list, idx, idx + 1);
    }
    return new Weight(list);
  }

  nbOfNon0() {
    let S = 0;
    for (let i = 0; i < this.weight.length; i++) {
      if (this.weight[i] !== 0) S++;
    }
    return S;
  }

  idxOfNon0() {
    let list = [];
    for (let i = 0; i < this.weight.length; i++) {
      if (this.weight[i] !== 0) {
        list.push(i);
      }
    }
    return list;
  }

  toStr() {
    return "(" + this.weight.join(",") + ")";
  }

  Print() {
    console.log(this.toStr());
  }
}
