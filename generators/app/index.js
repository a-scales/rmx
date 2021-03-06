var Generator   = require('yeoman-generator');
// var program     = require('ast-query');
// var recast      = require('recast');

module.exports = class extends Generator {
    constructor(args, opts) {
        super(args, opts);
        
        this.option("--test")
    }
    async prompting() {
        const answers = await this.prompt([{
            type    : 'input',
            name    : 'name',
            message : 'Enter Project Name',
            default : this.appname
        }]);
        this.appname = answers.name; 
        this.destinationRoot(this.appname)       
        this.log('Creating React/MobX app: ', answers.name);
    }

    configuring() {
        this.log("Running Creating React App");
        this.spawnCommandSync('npx',['create-react-app','.']);
        this.spawnCommandSync('npm',['run','eject']);

    }
    default() {
        
        
    }
    writing() {
        // Writing index.js to have mobx routing
        this.log("Attempting to overwirte index.js");
        this.fs.copyTpl(
            this.templatePath('main.js'),
            this.destinationPath('src/index.js')
        );
        
        // Writing movx stores and views
        this.log("Copying MobX store and views");
        this.fs.copyTpl(
            this.templatePath("Views.js"),
            this.destinationPath('src/Config/views.js')
        );
        this.fs.copyTpl(
            this.templatePath("Store.js"),
            this.destinationPath('src/Store/index.js')
        );
        // Writing first page
        this.fs.copyTpl(
            this.templatePath("pages/Home.js"),
            this.destinationPath('src/Pages/Home.js')
        );
        
        // Reading package.json and adding support for decorators
        let package = this.fs.readJSON(this.destinationPath("package.json"));
        package['babel']['plugins'] = ["transform-decorators-legacy"];
        this.fs.writeJSON(this.destinationPath("package.json"),package);
    }
    install() {
        this.npmInstall('babel-plugin-transform-decorators-legacy',{'save-dev': true});
        this.npmInstall('mobx',{'save':true});
        this.npmInstall('mobx-react',{'save':true});
        this.npmInstall('mobx-router',{'save':true});
        // this.npmInstall('sass-loader',{'save-dev':true});
        // this.npmInstall('node-sass',{'save-dev':true});
    }

    end() {
        this.config.save()
    }

    testMethod() {
        // this.log("Test Method");
    }
};