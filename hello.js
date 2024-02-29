const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function PriorityQueue() {
  this._nodes = [];

  this.enqueue = function (priority, key) {
    this._nodes.push({ key: key, priority: priority });
    this.sort();
  };
  this.dequeue = function () {
    return this._nodes.shift().key;
  };
  this.sort = function () {
    this._nodes.sort(function (a, b) {
      return a.priority - b.priority;
    });
  };
  this.isEmpty = function () {
    return !this._nodes.length;
  };
}

function Graph() {
  const INFINITY = 1 / 0;
  this.vertices = {};

  this.addVertex = function (name, edges) {
    this.vertices[name] = edges;
  };

  this.shortestPath = function (start, finish) {
    const nodes = new PriorityQueue(),
        distances = {},
        previous = {},
        path = [];
    let smallest, vertex, neighbor, alt;

    for (vertex in this.vertices) {
      if (vertex === start) {
        distances[vertex] = 0;
        nodes.enqueue(0, vertex);
      } else {
        distances[vertex] = INFINITY;
        nodes.enqueue(INFINITY, vertex);
      }

      previous[vertex] = null;
    }

    while (!nodes.isEmpty()) {
      smallest = nodes.dequeue();

      if (smallest === finish) {
        path.length = 0; // Clear the path array

        while (previous[smallest]) {
          path.push(smallest);
          smallest = previous[smallest];
        }

        break;
      }

      if (!smallest || distances[smallest] === INFINITY) {
        continue;
      }

      for (neighbor in this.vertices[smallest]) {
        alt = distances[smallest] + this.vertices[smallest][neighbor];

        if (alt < distances[neighbor]) {
          distances[neighbor] = alt;
          previous[neighbor] = smallest;

          nodes.enqueue(alt, neighbor);
        }
      }
    }

    if (path.length === 0) {
      return { distance: Infinity, path: [] };
    }

    path.push(start);
    path.reverse();

    return { distance: distances[finish], path: path };
  };
}

var g = new Graph();

g.addVertex('A', { B: 7, C: 8 });
g.addVertex('B', { A: 7, F: 2 });
g.addVertex('C', { A: 8, F: 6, G: 4 });
g.addVertex('D', { F: 8 });
g.addVertex('E', { H: 1 });
g.addVertex('F', { B: 2, C: 6, D: 8, G: 9, H: 3 });
g.addVertex('G', { C: 4, F: 9 });
g.addVertex('H', { E: 1, F: 3 });

rl.question('Enter start vertex: ', (startVertex) => {
  rl.question('Enter end vertex: ', (endVertex) => {
    console.log(g.shortestPath(startVertex, endVertex));
    rl.close();
  });
});
