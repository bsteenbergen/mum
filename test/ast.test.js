import assert from "assert"
import util from "util"
import ast from "../src/ast.js"

const simplePrint = `
mumble 14`
const simplePrintExpected = `   1 | Program statements=[#2]
   2 | PrintStatement argument=(Int,"14")`

const vars = `
  int x = 5
  x = x + 1
`
const varsExpected = `   1 | Program statements=[#2,#4]
   2 | VariableDeclaration type=#3 name=(Id,"x") initializer=(Int,"5")
   3 | TypeName typeName=(Sym,"int")
   4 | VariableAssignment name=(Id,"x") initializer=#5
   5 | BinaryExpression left=(Id,"x") op='+' right=(Int,"1")`

const printVar = `
str x = "hi" @ var decl
mumble x @ print statement
`
const printVarExpected = `   1 | Program statements=[#2,#4]
   2 | VariableDeclaration type=#3 name=(Id,"x") initializer=(Str,""hi"")
   3 | TypeName typeName=(Sym,"str")
   4 | PrintStatement argument=(Id,"x")`

const funcDecl = `
#my_func:
  mumble str_1
#`
const funcDeclExpected = `   1 | Program statements=[#2]
   2 | FunctionDeclaration funcName=(Id,"#my_func") suite=#3
   3 | Suite statements=[#4]
   4 | PrintStatement argument=(Id,"str_1")`

const funCalls = `
@ function calls 
bl #set_values
b #print_values`
const funCallExpected = `   1 | Program statements=[#2,#3]
   2 | FunctionCall link=(Sym,"bl") funcName=(Id,"#set_values") condition=[]
   3 | FunctionCall link=(Sym,"b") funcName=(Id,"#print_values") condition=[]`

const cmp = `
cmp var_1 var_2`
const cmpExpected = `   1 | Program statements=[#2]
   2 | CompareInstruction args=[(Id,"var_1"),(Id,"var_2")]`

const math = `
  int a = 3
  int c = 4
  a - c 
  2 + 4
  int a = 3 % 4
`

const mathExpected = `   1 | Program statements=[#2,#4,#6,#7,#8]
   2 | VariableDeclaration type=#3 name=(Id,"a") initializer=(Int,"3")
   3 | TypeName typeName=(Sym,"int")
   4 | VariableDeclaration type=#5 name=(Id,"c") initializer=(Int,"4")
   5 | TypeName typeName=(Sym,"int")
   6 | BinaryExpression left=(Id,"a") op='-' right=(Id,"c")
   7 | BinaryExpression left=(Int,"2") op='+' right=(Int,"4")
   8 | VariableDeclaration type=#9 name=(Id,"a") initializer=#10
   9 | TypeName typeName=(Sym,"int")
  10 | BinaryExpression left=(Int,"3") op='%' right=(Int,"4")`

const ifStmt = `#if x < 1 :
  x = x + 1
#`
const ifStmtExpected = `   1 | Program statements=[#2]
   2 | IfStatement condition=#3 suite=#4
   3 | BinaryExpression left=(Id,"x") op='<' right=(Int,"1")
   4 | Suite statements=[#5]
   5 | VariableAssignment name=(Id,"x") initializer=#6
   6 | BinaryExpression left=(Id,"x") op='+' right=(Int,"1")`

const whileLoop = `
#loop:
  mumble "hi"
  b #loop x < 10 @ "loop only if x < 10
#`
const whileExpected = `   1 | Program statements=[#2]
   2 | FunctionDeclaration funcName=(Id,"#loop") suite=#3
   3 | Suite statements=[#4,#5]
   4 | PrintStatement argument=(Str,""hi"")
   5 | FunctionCall link=(Sym,"b") funcName=(Id,"#loop") condition=[#6]
   6 | BinaryExpression left=(Id,"x") op='<' right=(Int,"10")`

const complexRelop = `let x = c < d < e`
const complexRelopExpected = `   1 | Program statements=[(Id,"let"),#2]
   2 | VariableAssignment name=(Id,"x") initializer=#3
   3 | BinaryExpression left=#4 op='<' right=(Id,"e")
   4 | BinaryExpression left=(Id,"c") op='<' right=(Id,"d")`

const initVarAsRelopResult = `bool i = 9 > 10`
const initVarAsRelopResultExpected = `   1 | Program statements=[#2]
   2 | VariableDeclaration type=#3 name=(Id,"i") initializer=#4
   3 | TypeName typeName=(Sym,"bool")
   4 | BinaryExpression left=(Int,"9") op='>' right=(Int,"10")`

// console.log(util.format(ast(initVarAsRelopResult)))

describe("The AST generator produces a correct AST for ", () => {
  it("print statements", () => {
    assert.deepStrictEqual(util.format(ast(simplePrint)), simplePrintExpected)
  }),
    it("variable declarations", () => {
      assert.deepStrictEqual(util.format(ast(printVar)), printVarExpected)
    }),
    it("function declarations", () => {
      assert.deepStrictEqual(util.format(ast(funcDecl)), funcDeclExpected)
    }),
    it("function calls", () => {
      assert.deepStrictEqual(util.format(ast(funCalls)), funCallExpected)
    }),
    it("compare instruction", () => {
      assert.deepStrictEqual(util.format(ast(cmp)), cmpExpected)
    }),
    it("binary operations", () => {
      assert.deepStrictEqual(util.format(ast(math)), mathExpected)
    }),
    it("variable declaration and reassignment", () => {
      assert.deepStrictEqual(util.format(ast(vars)), varsExpected)
    }),
    it("if statements", () => {
      assert.deepStrictEqual(util.format(ast(ifStmt)), ifStmtExpected)
    }),
    it("while loop", () => {
      assert.deepStrictEqual(util.format(ast(whileLoop)), whileExpected)
    }),
    it("complex/nested relop", () => {
      assert.deepStrictEqual(
        util.format(ast(complexRelop)),
        complexRelopExpected
      )
    }),
    it("initialize variable to result of binary expression", () => {
      assert.deepStrictEqual(
        util.format(ast(initVarAsRelopResult)),
        initVarAsRelopResultExpected
      )
    })
  // it("produces a correct AST with maps", () => {
  //   assert.deepStrictEqual(util.format(ast(mapSrc)), mapExpected)
  // })
})
