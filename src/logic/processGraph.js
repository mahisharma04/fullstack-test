/**
 * Processes a list of edge strings to build hierarchies and detect cycles.
 * 
 * @param {string[]} edges - Array of strings in "X->Y" format.
 * @returns {Object} - Result object with hierarchies, invalid entries, duplicates, and summary.
 */
const processGraph = (edges) => {
  const invalid_entries = [];
  const duplicate_edges = [];
  const unique_valid_edges = [];
  const seen_edges = new Set();
  const reported_duplicates = new Set();

  // 1. VALIDATION
  if (Array.isArray(edges)) {
    edges.forEach((rawEdge) => {
      if (typeof rawEdge !== 'string') {
        invalid_entries.push(String(rawEdge));
        return;
      }

      const trimmed = rawEdge.trim();
      const match = trimmed.match(/^([A-Z])->([A-Z])$/);

      if (!match) {
        invalid_entries.push(trimmed);
        return;
      }

      const [_, start, end] = match;

      if (start === end) {
        invalid_entries.push(trimmed);
        return;
      }

      if (seen_edges.has(trimmed)) {
        if (!reported_duplicates.has(trimmed)) {
          duplicate_edges.push(trimmed);
          reported_duplicates.add(trimmed);
        }
      } else {
        seen_edges.add(trimmed);
        unique_valid_edges.push({ from: start, to: end, raw: trimmed });
      }
    });
  }

  // 2. GRAPH BUILDING & DIAMOND RULE
  const adj = {}; // parent -> [children]
  const hasParent = new Set();
  const allNodes = new Set();

  unique_valid_edges.forEach(({ from, to }) => {
    allNodes.add(from);
    allNodes.add(to);

    if (hasParent.has(to)) {
      // Diamond rule: silently discard second parent edge
      return;
    }

    if (!adj[from]) adj[from] = [];
    adj[from].push(to);
    hasParent.add(to);
  });

  // 3. CONNECTED GROUPS (Undirected approach)
  const undirectedAdj = {};
  allNodes.forEach(node => undirectedAdj[node] = new Set());
  unique_valid_edges.forEach(({ from, to }) => {
    // Only add if it wasn't discarded by diamond rule
    if (adj[from] && adj[from].includes(to)) {
      undirectedAdj[from].add(to);
      undirectedAdj[to].add(from);
    }
  });

  const visitedGroups = new Set();
  const groups = [];

  allNodes.forEach((node) => {
    if (!visitedGroups.has(node)) {
      const group = [];
      const queue = [node];
      visitedGroups.add(node);

      while (queue.length > 0) {
        const curr = queue.shift();
        group.push(curr);
        undirectedAdj[curr].forEach((neighbor) => {
          if (!visitedGroups.has(neighbor)) {
            visitedGroups.add(neighbor);
            queue.push(neighbor);
          }
        });
      }
      groups.push(group);
    }
  });

  // 4. PROCESS EACH GROUP
  const hierarchies = [];
  let total_trees = 0;
  let total_cycles = 0;
  let maxDepth = -1;
  let largestTreeRoot = null;

  groups.forEach((group) => {
    // Find root: no parent in THIS group
    const roots = group.filter(node => !hasParent.has(node)).sort();
    let root = roots.length > 0 ? roots[0] : group.sort()[0];

    // Cycle detection using DFS
    const visitedDFS = new Set();
    const recStack = new Set();
    let hasCycle = false;

    const checkCycle = (u) => {
      visitedDFS.add(u);
      recStack.add(u);

      const children = adj[u] || [];
      for (const v of children) {
        if (!visitedDFS.has(v)) {
          if (checkCycle(v)) return true;
        } else if (recStack.has(v)) {
          return true;
        }
      }

      recStack.delete(u);
      return false;
    };

    // Since it's a connected group (undirected), we start DFS from root
    // But a cycle might not be reachable from the "picked" root if it's a pure cycle + disconnected components
    // However, the group is connected undirected. In a directed sense, we check all nodes in group.
    for (const node of group) {
      if (!visitedDFS.has(node)) {
        if (checkCycle(node)) {
          hasCycle = true;
          break;
        }
      }
    }

    if (hasCycle) {
      hierarchies.push({ root, tree: {}, has_cycle: true });
      total_cycles++;
    } else {
      // Build nested tree and calculate depth
      const buildTree = (u) => {
        const treeObj = {};
        const children = (adj[u] || []).sort();
        let currentMaxChildDepth = 0;

        children.forEach((v) => {
          const { nodeObj, depth } = buildTree(v);
          treeObj[v] = nodeObj[v];
          currentMaxChildDepth = Math.max(currentMaxChildDepth, depth);
        });

        return {
          nodeObj: { [u]: treeObj },
          depth: 1 + currentMaxChildDepth
        };
      };

      const { nodeObj, depth } = buildTree(root);
      hierarchies.push({ root, tree: nodeObj, depth });
      total_trees++;

      // Update largest tree summary
      if (depth > maxDepth) {
        maxDepth = depth;
        largestTreeRoot = root;
      } else if (depth === maxDepth) {
        if (!largestTreeRoot || root < largestTreeRoot) {
          largestTreeRoot = root;
        }
      }
    }
  });

  return {
    user_id: "your_user_id", // To be filled by user
    email_id: "your_email@example.com", // To be filled by user
    enrollment_number: "your_enrollment_number", // To be filled by user
    hierarchies,
    invalid_entries,
    duplicate_edges,
    summary: {
      total_trees,
      total_cycles,
      largest_tree_root: largestTreeRoot
    }
  };
};

module.exports = {
  processGraph,
};
