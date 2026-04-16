class Polynomial {
  constructor(t) {
    if (t instanceof Monomial) {
      this.terms = [t];
    } else {
      this.terms = t.slice(); // copy
    }
  }

    static monoKey(m) {
    let s = "";
    for (let i = 0; i < m.a.length; i++) {
        s += m.a[i] + "," + m.b[i] + "|";
    }
    return s;
    }
    
    static addPoly(p1, p2) {
        let map = {};

        function process(m) {
            let key = Polynomial.monoKey(m);

            if (!(key in map)) {
            map[key] = new Monomial(
                m.a.slice(),
                m.b.slice(),
                m.sign
            );
            } else {
            map[key].sign += m.sign;
            }
        }

        p1.terms.forEach(process);
        p2.terms.forEach(process);

        // rebuild list, remove zeros
        let out = [];
        for (let key in map) {
            if (map[key].sign !== 0) {
            out.push(map[key]);
            }
        }

        return new Polynomial(out);
    }

    static multiplyPoly(p1, p2) {
        let terms = [];

        for (let m1 of p1.terms) {
            for (let m2 of p2.terms) {
            terms.push(m1.Mult(m2)); // Monomial multiplication
            }
        }

        return new Polynomial(terms);
    }


    Print() {
        if (this.terms.length === 0) {
        console.log("0");
        return;
        }
        let s = this.terms.map(m => m.toStr()).join(" + ");
        console.log(s);
    }

    latexFormat() {
        return this.terms.map(m => m.latexFormat()).join(" + ");
    }
}