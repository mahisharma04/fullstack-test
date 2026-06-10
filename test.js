const { processGraph } = require('./src/logic/processGraph');

const runTests = () => {
  const tests = [
    {
      name: "1. Trimming spaces",
      input: [" A->B ", "C->D "],
      check: (res) => res.hierarchies.some(h => h.root === 'A') && res.invalid_entries.length === 0
    },
    {
      name: "2. Unique duplicate_edges",
      input: ["A->B", "A->B", "A->B"],
      check: (res) => res.duplicate_edges.length === 1 && res.duplicate_edges[0] === "A->B"
    },
    {
      name: "3. Diamond Rule (discard second parent)",
      input: ["A->D", "B->D"],
      check: (res) => {
        // D should only have one parent (A). 
        // A should be a root of a tree containing D. 
        // B should be a root of a tree containing NOTHING.
        const treeA = res.hierarchies.find(h => h.root === 'A');
        const treeB = res.hierarchies.find(h => h.root === 'B');
        return treeA.tree.A.D !== undefined && Object.keys(treeB.tree.B).length === 0;
      }
    },
    {
      name: "4. Pure cycle with no root (lex smallest root)",
      input: ["X->Y", "Y->Z", "Z->X"],
      check: (res) => res.hierarchies[0].root === "X" && res.hierarchies[0].has_cycle === true
    },
    {
      name: "5. largest_tree_root tiebreaker (lex smaller root)",
      input: ["B->C", "A->D"], // Both depth 2. A < B.
      check: (res) => res.summary.largest_tree_root === "A"
    }
  ];

  let passed = 0;
  tests.forEach(t => {
    const result = processGraph(t.input);
    if (t.check(result)) {
      console.log(`✅ PASSED: ${t.name}`);
      passed++;
    } else {
      console.log(`❌ FAILED: ${t.name}`);
      console.log('Result:', JSON.stringify(result, null, 2));
    }
  });

  console.log(`\nResults: ${passed}/${tests.length} tests passed.`);
};

runTests();
