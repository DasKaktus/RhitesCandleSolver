import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

Template.solver.onCreated(function helloOnCreated() {
  // counter starts at 0
  this.output = new ReactiveVar();
  this.inputs = new Array();
  this.counter = new ReactiveVar(0);
  this.notDone = new ReactiveVar(true);
});

Template.solver.helpers({
  solution() {
    return Template.instance().output.get();
  },
  notDone(){
    return Template.instance().notDone.get();
  }
});

//Hello Solkov, please excuse my spagehtti code I am no good with javascript oh god please send help
Template.solver.events({
  'submit .add-sequence'(event) {
    // Prevent default browser form submit
    event.preventDefault();

    // Get value from form element
    const target = event.target;
    const text = target.sequence.value;
    Template.instance().inputs.push(text);
    Template.instance().counter.set(Template.instance().counter.get() + 1);

    if (Template.instance().counter.get() == 7) {
      Template.instance().notDone.set(false);
      //Initialize Arrays
      var array = new Array(7);   //Current state
      var switches = new Array(7);//State changes

      for (var i = 0; i < 7; i++) {
        switches[i] = new Array(7);
        array[i] = new Array(7);
        for (var j = 0; j < 7; j++) {
          array[i][j] = 0;
        };
      };


      //Populate array by putting ones in position with turned on lights
      for (var i = 0; i < 7; i++) {
        var cur = Template.instance().inputs[i].split(',');
        for (var j = 0; j < cur.length; j++) {
          array[i][cur[j]-1] = 1;
        };
      };
      //Copy array
      for (var i = 0; i < 7; i++) {
        switches[0][i] = array[0][i];
      };
      //check which lamp switches which other lamps
      for (var i = 1; i < 7; i++) {
        for (var j = 0; j < 7; j++) {
           if (array[i-1][j] != array[i][j]) {
            switches[i][j] = 1
          } else{switches[i][j] = 0};
          //console.log(i-1 + ":" + array[i-1][j] + ";" + i + ":" + array[i][j]);
         };
      };
      //console.log(switches);
      var count = 0;
      //all possible lamp combinations
      var perms = new Array([0],[1],[2],[3],[4],[5],[6],
                            [0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[1,2],[1,3],[1,4],[1,5],[1,6],
                            [2,3],[2,4],[2,5],[2,6],[3,4],[3,5],[3,6],[4,5],[4,6],[5,6],[0,1,2],
                            [0,1,3],[0,1,4],[0,1,5],[0,1,6],[0,2,3],[0,2,4],[0,2,5],[0,2,6],
                            [0,3,4],[0,3,5],[0,3,6],[0,4,5],[0,4,6],[0,5,6],[1,2,3],[1,2,4],
                            [1,2,5],[1,2,6],[1,3,4],[1,3,5],[1,3,6],[1,4,5],[1,4,6],[1,5,6],[2,3,4],
                            [2,3,5],[2,3,6],[2,4,5],[2,4,6],[2,5,6],[3,4,5],[3,4,6],[3,5,6],[4,5,6],
                            [0,1,2,3],[0,1,2,4],[0,1,2,5],[0,1,2,6],[0,1,3,4],[0,1,3,5],[0,1,3,6],
                            [0,1,4,5],[0,1,4,6],[0,1,5,6],[0,2,3,4],[0,2,3,5],[0,2,3,6],[0,2,4,5],
                            [0,2,4,6],[0,2,5,6],[0,3,4,5],[0,3,4,6],[0,3,5,6],[0,4,5,6],[1,2,3,4],
                            [1,2,3,5],[1,2,3,6],[1,2,4,5],[1,2,4,6],[1,2,5,6],[1,3,4,5],[1,3,4,6],
                            [1,3,5,6],[1,4,5,6],[2,3,4,5],[2,3,4,6],[2,3,5,6],[2,4,5,6],[3,4,5,6],
                            [0,1,2,3,4],[0,1,2,3,5],[0,1,2,3,6],[0,1,2,4,5],[0,1,2,4,6],[0,1,2,5,6],
                            [0,1,3,4,5],[0,1,3,4,6],[0,1,3,5,6],[0,1,4,5,6],[0,2,3,4,5],[0,2,3,4,6],
                            [0,2,3,5,6],[0,2,4,5,6],[0,3,4,5,6],[1,2,3,4,5],[1,2,3,4,6],[1,2,3,5,6],
                            [1,2,4,5,6],[1,3,4,5,6],[2,3,4,5,6],
                            [0,1,2,3,4,5],[0,1,2,3,4,6],[0,1,2,3,5,6],[0,1,2,4,5,6],[0,1,3,4,5,6],
                            [0,2,3,4,5,6],[1,2,3,4,5,6],[0,1,2,3,4,5,6]);
      //Search solution, iterate over permutations
      for (var i = 0; i < perms.length; i++) {
        //create result array, inialize with last turned on state
        var result = array[6].slice();

        //Get solution array and shift candles
        var solution = perms[i].slice();
        for (var t = 0; t < solution.length; t++) {
          if (solution[t]-t+1<= 0) {solution[t] = solution[t]-t+8}
            else{solution[t] = solution[t]-t+1};
          console.log(perms[i][t]);
        };
        //console.log(switches);
        for (var l = 0; l < perms[i].length; l++) {

          //calculate result array by comparing current result and entry in switches
          for (var j = 0; j < 7; j++) {
            var temp = result[j] + switches[perms[i][l]][j];
            //console.log(result + " : " + switches[perms[i][l]])
            if (temp == 2) {result[j] = 0}
              else{result[j] = temp};
            var res = 0;

            //check if all entries in result array are 1
            for (var k = 0; k < 7; k++) {
              res = res + result[k];
            };
          };
          //break and return solution
          if (res == 7) {
            Template.instance().output.set("Solution: " + solution);
            count = -1;
            break;
          };
          if (count == -1) {break;};
        };
        if (count == -1) {break;};
        count = count + 1;
      };
      if (count == perms.length) {Template.instance().output.set("No solution!")};
    }


    // Clear form
    target.sequence.value = '';
  },
});
