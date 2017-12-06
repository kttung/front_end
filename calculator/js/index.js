var entry = "0";
var is_last_entry_ops = false;
var display_html = "";
var secondary_html = "";
var ROUNDING_NUM = 1000000000;

var num_stack = [];
var ops_stack = [];

$(document).ready(function() {
  $("button").on('click', function() {
    processButton($(this).val());
  })
});

function redrawScreen() {
  $(".display").html(display_html);
  $(".secondary-display").html(secondary_html);
}

function processButton(val) {
  switch (val) {
    case "C":
      num_stack = [];
      ops_stack = [];
      entry = "0";
      display_html = entry;
      secondary_html = "";
      is_last_entry_ops = false;
      break;
    case "CE":
      entry = "0";
      display_html = entry;
      is_last_entry_ops = false;
      break;
    case "N":
      if (entry!="0") entry = "-"+entry;
      display_html = entry;
      is_last_entry_ops = false;
      break;
    case "B":
      if ((entry[0]=="-" && entry.length==2) || entry.length==1) entry="0";
      else entry = entry.slice(0, entry.length-1);      
      display_html = entry;
      is_last_entry_ops = false;
      break;      
    case ".":
      if (entry.search(/\./g)<0) entry += ".";
      display_html = entry;
      is_last_entry_ops = false;
      break;
    case "0": case "1": case "2": case "3": case "4":case "5": case "6": case "7": case "8": case "9":
      if (entry=="0") entry=val;
      else if (entry.length > 15) {
        // fixed length limit, can be improved
      }
      else entry += val;
      display_html = entry;
      is_last_entry_ops = false;
      break;
    case "=":
      var num = Number.parseFloat(entry);
      var result = evaluateStacks(num);
      display_html = Math.round(result * ROUNDING_NUM)/ROUNDING_NUM;            
      num_stack = [];        
      ops_stack = [];        
      secondary_html = "";
      entry = "0";            
      is_last_entry_ops = false;
      break; // case =
    default:
      if (is_last_entry_ops) {        
        secondary_html = secondary_html.slice(0,secondary_html.length-1) + val;  // 
        ops_stack[num_stack.length-1] = val;
      }
      else {        
        var curnum = Number.parseFloat(entry);
        secondary_html += curnum + val;                    
        entry = "0";                                            
        
        reduceStacks(curnum, val);                
      }                  
      is_last_entry_ops = true;

  }
  redrawScreen();    
}

function reduceStacks(num, op)  { 
  if (ops_stack.length>0) {
    var last_op = ops_stack[ops_stack.length-1];
    if (last_op!="-" && last_op!="+") {  // if the last ops are either * or /, evaluate right away
      var last_num = num_stack.pop();
      if (last_op=='x') {
        num_stack.push(last_num * num);
      }
      else {
        num_stack.push(last_num / num);
      } 
      ops_stack[ops_stack.length-1] = op;
      return;
    } // * and /
  }
  num_stack.push(num);
  ops_stack.push(op);            
}

function evaluateStacks(num) { // given the final num, evaluate the (reduced) stack 
  if (ops_stack.length==0) return num;
  var last_op = ops_stack[ops_stack.length-1];
  if (last_op!='+' && last_op!='-') { // only the last_op can be * or /
    var last_num = num_stack.pop();
    if (last_op=='x') last_num *= num;
    else last_num /= num;
    num_stack.push(last_num);
    ops_stack.pop();
  }
  else num_stack.push(num);
    
  var result = num_stack[0]; 
  for (var i = 1; i<num_stack.length; i++) {
    if (ops_stack[i-1]=='+')
      result += num_stack[i];
    else result -= num_stack[i];
  }
  //console.log(num_stack, ops_stack, num, result);
  return result;
}