var Generator = require('yeoman-generator');
var recast      = require('recast');
var esprima     = require('esprima');

module.exports = class extends Generator {
    constructor(args, opts) {
        super(args, opts);
        if(!this.fs.exists(this.destinationPath('.yo-rc.json'))) {
            this.log("Run this inside of a rmx gen project");
            process.exit(0);
        }
        // Get pagename argument
        this.argument('pagename',{type: String, required: true, desc:"New Page Name"})
        // Load all HTML tags
        this.tags = this.fs.read(this.templatePath('allHTMLTags.txt')).split('\n');
        // Make sure the user entered tag is already an HTML tag
        if(this.tags.includes(this.options.pagename)) {
            this.log("Don't Use Existing HTML Tags!")
            process.exit(0);
        } else {
            // Set pagename
            this.newPageName = this.options.pagename;
        }
    }
    async prompting() {
        // Decided to just use arguments over prompts for this sub-generator.

        // this.log(this.tags);
        // const answers = await this.prompt([{
        //     type    : 'input',
        //     name    : 'name',
        //     message : 'New Page Name',
        //     validate: (input) => {
        //         if(this.tags.includes(input.toLowerCase())) {
        //             // this.log("Don't use existing HTML Tags");
        //             return "Don't Use Existing HTML tags!"
        //         } return true;
        //     } 
        // }]);
        // this.destinationRoot('./')
        this.log(this.destinationPath());  
        // this.newPageName = answers.name;
        this.log('Creating React/MobX Page: ', this.newPageName);
        // TODO: Add Custom Path
    }

    makePage() {
        // make the path lowercase always, and capitalize the name of the component.
        let newPath = this.newPageName.toLowerCase(), componentName = this.newPageName.charAt(0).toUpperCase() + this.newPageName.slice(1);
        // TODO: Switch context to destinationPath 
        const webcon = this.fs.read(this.destinationPath('src/Config/views.js'));
        // Line-by-line array of the code, if editing via locs, this is used. 
        const linemap = webcon.split(/\r?\n/);
        try {
            var prog = esprima.parseModule(webcon,{jsx:true, tolerant:true, tokens:true, loc: true});
        } catch(error) {
            console.log("Error:",error);
        }
        // this.log(prog.tokens.filter(x => x.value == 'constructor'));
        let importStatement = (`import ${componentName} from '../Pages/${componentName}'`)
        let importStatement_Parsed = esprima.parseModule(importStatement);
        // this.log(importStatement_Parsed.body[0])

        // Prepend the import statement to the top
        prog.body.unshift(importStatement_Parsed.body[0]);    

        // Find the class declaration and constructor. Two most important bits.
        let firstClass_Declaration = prog.body.filter(x => x.type == 'ClassDeclaration')[0];
        let firstClass_Constructor = firstClass_Declaration.body.body.filter(x => x.kind == 'constructor')[0];

        // Get the section of the Views file that contains the views object.
        let views = firstClass_Constructor.value.body.body.filter(e => e.expression.left.property.name == 'views')[0];

        // Parse the new route, and get the property value from the AST
        let newRoute = `let newProp = {${componentName}: new Route({path: "\/${newPath}",component:<${componentName} />})}`;
        let newRoute_Parsed = esprima.parseScript(newRoute,{jsx:true,tolerant:true});
        let newRoute_Property = newRoute_Parsed.body[0].declarations[0].init.properties[0];
        // Add the route property
        views.expression.right.properties.push(newRoute_Property);

        // New page generated from template, with title eval'd in
        const newPage = this.fs.read(this.templatePath('pages/Home.js'))
        let pageTitle = componentName;
        // console.log(eval("`"+newPage+"`"));
        // console.log(recast.print(prog).code);
        // Save Page as String
        let newPage_Code = eval("`"+newPage+"`");
        let newPage_Route = `src/Pages/${pageTitle}.js`
        this.fs.write(this.destinationPath(newPage_Route), newPage_Code);
        let newViews_Code = recast.print(prog).code;
        this.fs.write(this.destinationPath('src/Config/views.js'), newViews_Code);

    }

};