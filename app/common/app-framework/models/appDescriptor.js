Bahmni.Common.AppFramework.AppDescriptor = function (context, inheritContext, retrieveUserCallback) {
    this.id = null;
    this.instanceOf = null;
    this.description = null;
    this.contextModel = null;

    this.extensionPoints = [];
    this.extensions = [];
    this.configs = [];
    this.formLayout = [];
    this.clinicalServices = [];
    this.drugMapping = [];

    this.extensionPath = context;
    this.contextPath = inheritContext ? context.split("/")[0] : context;

    var self = this;

    this.setFormLayout = formLayout => {
        self.formLayout = formLayout || [];
    };

    this.setClinicalServices = clinicalServices => {
        self.clinicalServices = clinicalServices || [];
    };

    this.setDrugMapping = drugMapping => {
        self.drugMapping = drugMapping || [];
    };

    this.setDefinition = instance => {
        self.instanceOf = instance.instanceOf;
        self.id = instance.id;
        self.description = instance.description;
        self.contextModel = instance.contextModel;
        if (instance.extensionPoints) {
            instance.extensionPoints.forEach(iep => {
                var existing = self.extensionPoints.filter(ep => ep.id == iep.id);
                if (existing.length === 0) {
                    self.extensionPoints.push(iep);
                }
            });
        }

        if (instance.config) {
            for (var configName in instance.config) {
                var existingConfig = self.getConfig(configName);
                if (existingConfig) {
                    existingConfig.value = instance.config[configName];
                } else {
                    self.configs.push({ name: configName, value: instance.config[configName] });
                }
            }
        }
    };

    this.getExtensions = (extPointId, type) => {
        var currentUser = retrieveUserCallback();
        if (currentUser && self.extensions) {
            var extnType = type || 'all';
            var userPrivileges = currentUser.privileges.map(priv => priv.retired ? "" : priv.name);
            var appsExtns = self.extensions.filter(extn => ((extnType === 'all') || (extn.type === extnType)) && (extn.extensionPointId === extPointId) && (!extn.requiredPrivilege || (userPrivileges.indexOf(extn.requiredPrivilege) >= 0)));
            appsExtns.sort((extn1, extn2) => extn1.order - extn2.order);
            return appsExtns;
        }
    };

    this.getId = () => self.id;

    this.getConfig = configName => {
        var cfgList = self.configs.filter(cfg => cfg.name == configName);
        return (cfgList.length > 0) ? cfgList[0] : null;
    };

    this.getConfigValue = function(configName) {
        var config = this.getConfig(configName);
        return config ? config.value : null;
    };

    this.formatUrl =  function (url, options, useQueryParams) {
        var pattern = /{{([^}]*)}}/g,
            matches = url.match(pattern),
            replacedString = url,
            checkQueryParams = useQueryParams || false,
            queryParameters = this.parseQueryParams();
        if (matches) {
            matches.forEach(el => {
                var key = el.replace("{{",'').replace("}}",'');
                var value = options[key];
                if (!value && (checkQueryParams===true)) {
                    value = queryParameters[key] || null;
                }
                replacedString = replacedString.replace(el, value);
            });
        }
        return replacedString.trim();
    };

    this.parseQueryParams = locationSearchString => {
        var urlParams;
        var match,
            pl     = /\+/g,  // Regex for replacing addition symbol with a space
            search = /([^&=]+)=?([^&]*)/g,
            decode = s => decodeURIComponent(s.replace(pl, " ")),
            queryString  = locationSearchString || window.location.search.substring(1);

        urlParams = {};
        while (match = search.exec(queryString)) {
           urlParams[decode(match[1])] = decode(match[2]);
        }
        return urlParams;
    };

  //TODO: Unused definition, to be removed after testing phase
    // this.addConfigForPage = function(pageName,config){
    //     self.pageConfigs= self.pageConfigs || {};
    //     self.pageConfigs[pageName] = config;
    // };

//TODO: Unused definition, to be removed after testing phase
    // this.getConfigForPage = function(pageName){
    //     return self.pageConfigs[pageName];
    // };

    this.getFormLayout = () => self.formLayout;

    this.getDrugMapping = () => self.drugMapping;

    this.getClinicalServices = () => self.clinicalServices;
};
