## Classes

<dl>
<dt><a href="#I18n">I18n</a></dt>
<dd><p>I18n class.</p>
</dd>
<dt><a href="#ClinicDashboardPage">ClinicDashboardPage</a> ⇐ <code><a href="#Page">Page</a></code></dt>
<dd><p>Represents the clinic dashboard page
and includes functionality that facilitates interacting
with the page during tests</p>
</dd>
<dt><a href="#ActionsComponent">ActionsComponent</a> ⇐ <code><a href="#Component">Component</a></code></dt>
<dd><p>The actions that a user can take on a patient</p>
</dd>
<dt><a href="#CheckInComponent">CheckInComponent</a> ⇐ <code><a href="#Component">Component</a></code></dt>
<dd><p>Functions that help tests interact with the checkin UI.
Effectivey, this component helps tests check the patient in</p>
</dd>
<dt><a href="#Component">Component</a></dt>
<dd><p>Represents a component of a page.
Many of the POC pages consist of multiple components.
In many cases we want to test the same component on different pages.
This class, and its subclasses, allow us to encapsulate functions that
test a specific component so we don&#39;t have to rewrite them on each page.
When a new page is defined is includes a list of components
that are added to the page. For example, lets say we define a new page
foo that has a component bar. Let&#39;s also say that the component bar defines
a function called hello. Because all properties of the components are added
to the page, callers can now call foo.hello(). This makes is easy to share
functionality across pages, and for tests to assumme functions are available
on the pages they&#39;re testing.</p>
</dd>
<dt><a href="#DeletePatientModalComponent">DeletePatientModalComponent</a> ⇐ <code><a href="#Component">Component</a></code></dt>
<dd><p>Defines functions that help tests interact with
the modal that pops up when a patient is being deleted</p>
</dd>
<dt><a href="#HeaderComponent">HeaderComponent</a> ⇐ <code><a href="#Component">Component</a></code></dt>
<dd><p>Functions that help interact with the main header</p>
</dd>
<dt><a href="#PatientSearchComponent">PatientSearchComponent</a> ⇐ <code><a href="#Component">Component</a></code></dt>
<dd><p>Functions that help tests interact with the patient search bar</p>
</dd>
<dt><a href="#TabsComponent">TabsComponent</a></dt>
<dd><p>Functions that help interact with pages with tabs</p>
</dd>
<dt><a href="#DashboardPage">DashboardPage</a> ⇐ <code><a href="#Page">Page</a></code></dt>
<dd><p>Represetns the main dashbaord page
and includes functionality that facilitates interacting
with the page during tests</p>
</dd>
<dt><a href="#LoginPage">LoginPage</a> ⇐ <code><a href="#Page">Page</a></code></dt>
<dd><p>Represents the login page
and includes functionality that facilitates interacting
with the page during tests</p>
</dd>
<dt><a href="#Page">Page</a></dt>
<dd><p>Represents a page on the POC website
A page consists of functions that help tests interact with the POC page
and can have multiple components which add common functionality.
Subclasses of Page pass in options that define when the page is loaded
and the names of the page&#39;s components, if any.
This class adds the component&#39;s properties
to the class instance which lets tests call component methods
on the instance as if they were one object. See Compoent for more details.</p>
</dd>
<dt><a href="#RegisterPatientPage">RegisterPatientPage</a> ⇐ <code><a href="#Page">Page</a></code></dt>
<dd><p>Represents the register patint page
and includes functionality that facilitates interacting
with the page during tests</p>
</dd>
<dt><a href="#VitalsAdultFormPage">VitalsAdultFormPage</a></dt>
<dd><p>Represents the vitals page for adults
and includes functionality that facilitates interacting
with the page during tests</p>
</dd>
<dt><a href="#ApiManager">ApiManager</a></dt>
<dd><p>ApiManager holds on to each Api. An instance of Api manager can be passed
into a test if that test needs to manipulate data on the server
A detaled description of each Api can be foudn at the following urls:
   <a href="https://wiki.openmrs.org/display/docs/REST+Web+Service+Resources+in+OpenMRS+1.8#RESTWebServiceResourcesinOpenMRS1.8-User">https://wiki.openmrs.org/display/docs/REST+Web+Service+Resources+in+OpenMRS+1.8#RESTWebServiceResourcesinOpenMRS1.8-User</a>
   <a href="https://psbrandt.io/openmrs-contrib-apidocs/">https://psbrandt.io/openmrs-contrib-apidocs/</a></p>
</dd>
<dt><a href="#Translator">Translator</a></dt>
<dd><p>This class provides translations for strings based on i18n.</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#login">login()</a></dt>
<dd><p>Logs the user in through the login page.
If no user is specified the admin user is used.</p>
</dd>
</dl>

<a name="I18n"></a>

## I18n
I18n class.

**Kind**: global class  

* [I18n](#I18n)
    * [new I18n(options)](#new_I18n_new)
    * [.loadTranslations()](#I18n+loadTranslations)
    * [.getTranslations(locale)](#I18n+getTranslations) ⇒ <code>Object</code>
    * [.t(key, view)](#I18n+t) ⇒ <code>String</code>
    * [.translate(key, view)](#I18n+translate) ⇒ <code>String</code>
    * [.getDirectoryPath(module, locale)](#I18n+getDirectoryPath) ⇒ <code>String</code>

<a name="new_I18n_new"></a>

### new I18n(options)
Loads the given options that are later used to
generate the appropriate translations.


| Param | Type |
| --- | --- |
| options | <code>Object</code> | 

<a name="I18n+loadTranslations"></a>

### i18n.loadTranslations()
Load translations from directory.

**Kind**: instance method of [<code>I18n</code>](#I18n)  
**Api**: private  
<a name="I18n+getTranslations"></a>

### i18n.getTranslations(locale) ⇒ <code>Object</code>
Get all translations for locale.

**Kind**: instance method of [<code>I18n</code>](#I18n)  
**Api**: private  

| Param | Type |
| --- | --- |
| locale | <code>String</code> | 

<a name="I18n+t"></a>

### i18n.t(key, view) ⇒ <code>String</code>
Translate a key.

**Kind**: instance method of [<code>I18n</code>](#I18n)  
**Api**: public  

| Param | Type |
| --- | --- |
| key | <code>String</code> | 
| view | <code>Object</code> | 

<a name="I18n+translate"></a>

### i18n.translate(key, view) ⇒ <code>String</code>
Translate a key.

**Kind**: instance method of [<code>I18n</code>](#I18n)  
**Api**: public  

| Param | Type |
| --- | --- |
| key | <code>String</code> | 
| view | <code>Object</code> | 

<a name="I18n+getDirectoryPath"></a>

### i18n.getDirectoryPath(module, locale) ⇒ <code>String</code>
Get normalized path directory.

**Kind**: instance method of [<code>I18n</code>](#I18n)  

| Param | Type |
| --- | --- |
| module | <code>String</code> | 
| locale | <code>String</code> | 

<a name="ClinicDashboardPage"></a>

## ClinicDashboardPage ⇐ [<code>Page</code>](#Page)
Represents the clinic dashboard page
and includes functionality that facilitates interacting
with the page during tests

**Kind**: global class  
**Extends**: [<code>Page</code>](#Page)  

* [ClinicDashboardPage](#ClinicDashboardPage) ⇐ [<code>Page</code>](#Page)
    * [.clickConsultationTab()](#ClinicDashboardPage+clickConsultationTab)
    * [.clickAddVitals()](#ClinicDashboardPage+clickAddVitals)
    * [._init()](#Page+_init)
    * [.isLoaded()](#Page+isLoaded)
    * [._addComponent(componentName)](#Page+_addComponent)
    * [.translate(key)](#Page+translate)

<a name="ClinicDashboardPage+clickConsultationTab"></a>

### clinicDashboardPage.clickConsultationTab()
Clicks the consultation tab

**Kind**: instance method of [<code>ClinicDashboardPage</code>](#ClinicDashboardPage)  
<a name="ClinicDashboardPage+clickAddVitals"></a>

### clinicDashboardPage.clickAddVitals()
Clicks the add vitals button

**Kind**: instance method of [<code>ClinicDashboardPage</code>](#ClinicDashboardPage)  
<a name="Page+_init"></a>

### clinicDashboardPage._init()
Initializes the page

**Kind**: instance method of [<code>ClinicDashboardPage</code>](#ClinicDashboardPage)  
<a name="Page+isLoaded"></a>

### clinicDashboardPage.isLoaded()
Validates that the page is loaded

**Kind**: instance method of [<code>ClinicDashboardPage</code>](#ClinicDashboardPage)  
<a name="Page+_addComponent"></a>

### clinicDashboardPage._addComponent(componentName)
Gets an instance of the component
and copies its properties and functions
to this page

**Kind**: instance method of [<code>ClinicDashboardPage</code>](#ClinicDashboardPage)  

| Param | Type | Description |
| --- | --- | --- |
| componentName | <code>string</code> | the name of the component to add |

<a name="Page+translate"></a>

### clinicDashboardPage.translate(key)
Translate using the default locale

**Kind**: instance method of [<code>ClinicDashboardPage</code>](#ClinicDashboardPage)  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | the key used to get the translated value |

<a name="ActionsComponent"></a>

## ActionsComponent ⇐ [<code>Component</code>](#Component)
The actions that a user can take on a patient

**Kind**: global class  
**Extends**: [<code>Component</code>](#Component)  

* [ActionsComponent](#ActionsComponent) ⇐ [<code>Component</code>](#Component)
    * [.clickBackFromDashboard(returnPage)](#ActionsComponent+clickBackFromDashboard)
    * [.clickTransferPatientButton()](#ActionsComponent+clickTransferPatientButton)
    * [.clickViewPatientButton()](#ActionsComponent+clickViewPatientButton)
    * [.clickEditPatientButton()](#ActionsComponent+clickEditPatientButton)
    * [.clickDeletePatientButton()](#ActionsComponent+clickDeletePatientButton)
    * [.transferToRegistrationModule()](#ActionsComponent+transferToRegistrationModule)
    * [.transferToSocialModule()](#ActionsComponent+transferToSocialModule)
    * [.transferToVitalsModule()](#ActionsComponent+transferToVitalsModule)
    * [.transferToClinicModule()](#ActionsComponent+transferToClinicModule)
    * [.transferToPharmacyModule()](#ActionsComponent+transferToPharmacyModule)
    * [.transferToLabModule()](#ActionsComponent+transferToLabModule)
    * [.transferToReportsModule()](#ActionsComponent+transferToReportsModule)
    * [.clickButton(buttonName, buttonElement)](#ActionsComponent+clickButton)
    * [._transferTo()](#ActionsComponent+_transferTo)
    * [.addToPage(page)](#Component+addToPage)
    * [.translate(key)](#Component+translate)

<a name="ActionsComponent+clickBackFromDashboard"></a>

### actionsComponent.clickBackFromDashboard(returnPage)
Returns to a page depending on the current dashboard page

**Kind**: instance method of [<code>ActionsComponent</code>](#ActionsComponent)  

| Param | Type | Description |
| --- | --- | --- |
| returnPage | [<code>Page</code>](#Page) | the page to return to |

<a name="ActionsComponent+clickTransferPatientButton"></a>

### actionsComponent.clickTransferPatientButton()
Pops up a dialog window with buttons to transfer the patient from
one app/module to another

**Kind**: instance method of [<code>ActionsComponent</code>](#ActionsComponent)  
<a name="ActionsComponent+clickViewPatientButton"></a>

### actionsComponent.clickViewPatientButton()
Opens the patient details page

**Kind**: instance method of [<code>ActionsComponent</code>](#ActionsComponent)  
<a name="ActionsComponent+clickEditPatientButton"></a>

### actionsComponent.clickEditPatientButton()
Clicks the edit button and opens the edit patient page

**Kind**: instance method of [<code>ActionsComponent</code>](#ActionsComponent)  
<a name="ActionsComponent+clickDeletePatientButton"></a>

### actionsComponent.clickDeletePatientButton()
Clicks the delete patient button

**Kind**: instance method of [<code>ActionsComponent</code>](#ActionsComponent)  
<a name="ActionsComponent+transferToRegistrationModule"></a>

### actionsComponent.transferToRegistrationModule()
Transfer Patient to the registration module

**Kind**: instance method of [<code>ActionsComponent</code>](#ActionsComponent)  
<a name="ActionsComponent+transferToSocialModule"></a>

### actionsComponent.transferToSocialModule()
Transfer Patient to the social module

**Kind**: instance method of [<code>ActionsComponent</code>](#ActionsComponent)  
<a name="ActionsComponent+transferToVitalsModule"></a>

### actionsComponent.transferToVitalsModule()
Transfer Patient to the vitals module

**Kind**: instance method of [<code>ActionsComponent</code>](#ActionsComponent)  
<a name="ActionsComponent+transferToClinicModule"></a>

### actionsComponent.transferToClinicModule()
Transfer Patient to the clinic module

**Kind**: instance method of [<code>ActionsComponent</code>](#ActionsComponent)  
<a name="ActionsComponent+transferToPharmacyModule"></a>

### actionsComponent.transferToPharmacyModule()
Transfer Patient to the pharmacy module

**Kind**: instance method of [<code>ActionsComponent</code>](#ActionsComponent)  
<a name="ActionsComponent+transferToLabModule"></a>

### actionsComponent.transferToLabModule()
Transfer Patient to the lab module

**Kind**: instance method of [<code>ActionsComponent</code>](#ActionsComponent)  
<a name="ActionsComponent+transferToReportsModule"></a>

### actionsComponent.transferToReportsModule()
Transfer Patient to the report module

**Kind**: instance method of [<code>ActionsComponent</code>](#ActionsComponent)  
<a name="ActionsComponent+clickButton"></a>

### actionsComponent.clickButton(buttonName, buttonElement)
Clicks the given button

**Kind**: instance method of [<code>ActionsComponent</code>](#ActionsComponent)  

| Param | Type | Description |
| --- | --- | --- |
| buttonName | <code>string</code> | the name of the button being clicked |
| buttonElement | <code>object</code> | a css selector for the button |

<a name="ActionsComponent+_transferTo"></a>

### actionsComponent._transferTo()
Transfer the patient to an app by clicking the app's button

**Kind**: instance method of [<code>ActionsComponent</code>](#ActionsComponent)  
<a name="Component+addToPage"></a>

### actionsComponent.addToPage(page)
Copy properties from this component to the page.
excluding [I, constructor, create, and addToPage]

**Kind**: instance method of [<code>ActionsComponent</code>](#ActionsComponent)  

| Param | Type | Description |
| --- | --- | --- |
| page | [<code>Page</code>](#Page) | the page that this component's properties are added to |

<a name="Component+translate"></a>

### actionsComponent.translate(key)
Get the translated value associated with the given key

**Kind**: instance method of [<code>ActionsComponent</code>](#ActionsComponent)  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | the key used to get the translated value |

<a name="CheckInComponent"></a>

## CheckInComponent ⇐ [<code>Component</code>](#Component)
Functions that help tests interact with the checkin UI.
Effectivey, this component helps tests check the patient in

**Kind**: global class  
**Extends**: [<code>Component</code>](#Component)  

* [CheckInComponent](#CheckInComponent) ⇐ [<code>Component</code>](#Component)
    * [.clickCheckIn()](#CheckInComponent+clickCheckIn)
    * [.verifyCheckIn()](#CheckInComponent+verifyCheckIn)
    * [.addToPage(page)](#Component+addToPage)
    * [.translate(key)](#Component+translate)

<a name="CheckInComponent+clickCheckIn"></a>

### checkInComponent.clickCheckIn()
Clicks the check in button

**Kind**: instance method of [<code>CheckInComponent</code>](#CheckInComponent)  
<a name="CheckInComponent+verifyCheckIn"></a>

### checkInComponent.verifyCheckIn()
Verifies the check in was successful

**Kind**: instance method of [<code>CheckInComponent</code>](#CheckInComponent)  
<a name="Component+addToPage"></a>

### checkInComponent.addToPage(page)
Copy properties from this component to the page.
excluding [I, constructor, create, and addToPage]

**Kind**: instance method of [<code>CheckInComponent</code>](#CheckInComponent)  

| Param | Type | Description |
| --- | --- | --- |
| page | [<code>Page</code>](#Page) | the page that this component's properties are added to |

<a name="Component+translate"></a>

### checkInComponent.translate(key)
Get the translated value associated with the given key

**Kind**: instance method of [<code>CheckInComponent</code>](#CheckInComponent)  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | the key used to get the translated value |

<a name="Component"></a>

## Component
Represents a component of a page.
Many of the POC pages consist of multiple components.
In many cases we want to test the same component on different pages.
This class, and its subclasses, allow us to encapsulate functions that
test a specific component so we don't have to rewrite them on each page.
When a new page is defined is includes a list of components
that are added to the page. For example, lets say we define a new page
foo that has a component bar. Let's also say that the component bar defines
a function called hello. Because all properties of the components are added
to the page, callers can now call foo.hello(). This makes is easy to share
functionality across pages, and for tests to assumme functions are available
on the pages they're testing.

**Kind**: global class  

* [Component](#Component)
    * _instance_
        * [.addToPage(page)](#Component+addToPage)
        * [.translate(key)](#Component+translate)
    * _static_
        * [.create()](#Component.create)

<a name="Component+addToPage"></a>

### component.addToPage(page)
Copy properties from this component to the page.
excluding [I, constructor, create, and addToPage]

**Kind**: instance method of [<code>Component</code>](#Component)  

| Param | Type | Description |
| --- | --- | --- |
| page | [<code>Page</code>](#Page) | the page that this component's properties are added to |

<a name="Component+translate"></a>

### component.translate(key)
Get the translated value associated with the given key

**Kind**: instance method of [<code>Component</code>](#Component)  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | the key used to get the translated value |

<a name="Component.create"></a>

### Component.create()
Creates a new instance of a component based on the component's name

**Kind**: static method of [<code>Component</code>](#Component)  
<a name="DeletePatientModalComponent"></a>

## DeletePatientModalComponent ⇐ [<code>Component</code>](#Component)
Defines functions that help tests interact with
the modal that pops up when a patient is being deleted

**Kind**: global class  
**Extends**: [<code>Component</code>](#Component)  

* [DeletePatientModalComponent](#DeletePatientModalComponent) ⇐ [<code>Component</code>](#Component)
    * [.deletePatientModalIsLoaded()](#DeletePatientModalComponent+deletePatientModalIsLoaded)
    * [.deletePatient(deleteReason)](#DeletePatientModalComponent+deletePatient)
    * [.declarePatientAsDead(deathReason, deathDate)](#DeletePatientModalComponent+declarePatientAsDead)
    * [.verifyRestrictionToDeletePatient()](#DeletePatientModalComponent+verifyRestrictionToDeletePatient)
    * [.checkIsDeadBox()](#DeletePatientModalComponent+checkIsDeadBox)
    * [.verifyPatientDeathDetails()](#DeletePatientModalComponent+verifyPatientDeathDetails)
    * [._verifySaveButtonIsDisabled()](#DeletePatientModalComponent+_verifySaveButtonIsDisabled)
    * [._clickSaveButton()](#DeletePatientModalComponent+_clickSaveButton)
    * [.addToPage(page)](#Component+addToPage)
    * [.translate(key)](#Component+translate)

<a name="DeletePatientModalComponent+deletePatientModalIsLoaded"></a>

### deletePatientModalComponent.deletePatientModalIsLoaded()
Waits for the modal to finish loading and fails
the test if it never loads

**Kind**: instance method of [<code>DeletePatientModalComponent</code>](#DeletePatientModalComponent)  
<a name="DeletePatientModalComponent+deletePatient"></a>

### deletePatientModalComponent.deletePatient(deleteReason)
Deletes the patient

**Kind**: instance method of [<code>DeletePatientModalComponent</code>](#DeletePatientModalComponent)  

| Param | Type | Description |
| --- | --- | --- |
| deleteReason | <code>string</code> | the reason this patietn is being deleted |

<a name="DeletePatientModalComponent+declarePatientAsDead"></a>

### deletePatientModalComponent.declarePatientAsDead(deathReason, deathDate)
Declares the patient as dead

**Kind**: instance method of [<code>DeletePatientModalComponent</code>](#DeletePatientModalComponent)  

| Param | Type | Description |
| --- | --- | --- |
| deathReason | <code>string</code> | the reason the patient died |
| deathDate | <code>string</code> | the date the patient died |

<a name="DeletePatientModalComponent+verifyRestrictionToDeletePatient"></a>

### deletePatientModalComponent.verifyRestrictionToDeletePatient()
Verifies an alert popped up indicating the patient cannot be deleted

**Kind**: instance method of [<code>DeletePatientModalComponent</code>](#DeletePatientModalComponent)  
<a name="DeletePatientModalComponent+checkIsDeadBox"></a>

### deletePatientModalComponent.checkIsDeadBox()
Checks the box indicating the patient is dead

**Kind**: instance method of [<code>DeletePatientModalComponent</code>](#DeletePatientModalComponent)  
<a name="DeletePatientModalComponent+verifyPatientDeathDetails"></a>

### deletePatientModalComponent.verifyPatientDeathDetails()
Verifies the details about the patients death.
This should be called after the patient is decalred dead

**Kind**: instance method of [<code>DeletePatientModalComponent</code>](#DeletePatientModalComponent)  

| Param | Type | Description |
| --- | --- | --- |
| deathDetails.date | <code>string</code> | the date the patient died |
| deathDetails.reason | <code>string</code> | the reason the patient died |

<a name="DeletePatientModalComponent+_verifySaveButtonIsDisabled"></a>

### deletePatientModalComponent._verifySaveButtonIsDisabled()
Verifies the save button is disabled

**Kind**: instance method of [<code>DeletePatientModalComponent</code>](#DeletePatientModalComponent)  
<a name="DeletePatientModalComponent+_clickSaveButton"></a>

### deletePatientModalComponent._clickSaveButton()
Clicks the save button

**Kind**: instance method of [<code>DeletePatientModalComponent</code>](#DeletePatientModalComponent)  
<a name="Component+addToPage"></a>

### deletePatientModalComponent.addToPage(page)
Copy properties from this component to the page.
excluding [I, constructor, create, and addToPage]

**Kind**: instance method of [<code>DeletePatientModalComponent</code>](#DeletePatientModalComponent)  

| Param | Type | Description |
| --- | --- | --- |
| page | [<code>Page</code>](#Page) | the page that this component's properties are added to |

<a name="Component+translate"></a>

### deletePatientModalComponent.translate(key)
Get the translated value associated with the given key

**Kind**: instance method of [<code>DeletePatientModalComponent</code>](#DeletePatientModalComponent)  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | the key used to get the translated value |

<a name="HeaderComponent"></a>

## HeaderComponent ⇐ [<code>Component</code>](#Component)
Functions that help interact with the main header

**Kind**: global class  
**Extends**: [<code>Component</code>](#Component)  

* [HeaderComponent](#HeaderComponent) ⇐ [<code>Component</code>](#Component)
    * [.clickHome()](#HeaderComponent+clickHome)
    * [.verifySuccessToast(message)](#HeaderComponent+verifySuccessToast)
    * [.logout()](#HeaderComponent+logout)
    * [.addToPage(page)](#Component+addToPage)
    * [.translate(key)](#Component+translate)

<a name="HeaderComponent+clickHome"></a>

### headerComponent.clickHome()
Clicks the home button

**Kind**: instance method of [<code>HeaderComponent</code>](#HeaderComponent)  
<a name="HeaderComponent+verifySuccessToast"></a>

### headerComponent.verifySuccessToast(message)
Verifies the success toast popped up

**Kind**: instance method of [<code>HeaderComponent</code>](#HeaderComponent)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| message | <code>string</code> | <code>&quot;COMMON_MESSAGE_SUCCESS_ACTION_COMPLETED&quot;</code> | the expected toast message. Default is 'COMMON_MESSAGE_SUCCESS_ACTION_COMPLETED' |

<a name="HeaderComponent+logout"></a>

### headerComponent.logout()
Logs the user out

**Kind**: instance method of [<code>HeaderComponent</code>](#HeaderComponent)  
<a name="Component+addToPage"></a>

### headerComponent.addToPage(page)
Copy properties from this component to the page.
excluding [I, constructor, create, and addToPage]

**Kind**: instance method of [<code>HeaderComponent</code>](#HeaderComponent)  

| Param | Type | Description |
| --- | --- | --- |
| page | [<code>Page</code>](#Page) | the page that this component's properties are added to |

<a name="Component+translate"></a>

### headerComponent.translate(key)
Get the translated value associated with the given key

**Kind**: instance method of [<code>HeaderComponent</code>](#HeaderComponent)  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | the key used to get the translated value |

<a name="PatientSearchComponent"></a>

## PatientSearchComponent ⇐ [<code>Component</code>](#Component)
Functions that help tests interact with the patient search bar

**Kind**: global class  
**Extends**: [<code>Component</code>](#Component)  

* [PatientSearchComponent](#PatientSearchComponent) ⇐ [<code>Component</code>](#Component)
    * [.disableAutoSelect()](#PatientSearchComponent+disableAutoSelect)
    * [.search(text)](#PatientSearchComponent+search)
    * [.clickSearchResult(patient)](#PatientSearchComponent+clickSearchResult)
    * [.clearSearch()](#PatientSearchComponent+clearSearch)
    * [.seePatientRecord(patient)](#PatientSearchComponent+seePatientRecord)
    * [.dontSeePatientRecord(patient)](#PatientSearchComponent+dontSeePatientRecord)
    * [.seeNoResults()](#PatientSearchComponent+seeNoResults)
    * [.searchForPatientByIdAndSelect(patient)](#PatientSearchComponent+searchForPatientByIdAndSelect)
    * [.addToPage(page)](#Component+addToPage)
    * [.translate(key)](#Component+translate)

<a name="PatientSearchComponent+disableAutoSelect"></a>

### patientSearchComponent.disableAutoSelect()
By default the search bar with automatically select the first
patient in the results array. This is problem in several scenarios
including those that want to verify what's on the page without selecting
a patient and those that want to select a result other than the first.
This function must be called before searching the disable autoselection

**Kind**: instance method of [<code>PatientSearchComponent</code>](#PatientSearchComponent)  
<a name="PatientSearchComponent+search"></a>

### patientSearchComponent.search(text)
Searches in the search box

**Kind**: instance method of [<code>PatientSearchComponent</code>](#PatientSearchComponent)  

| Param | Type | Description |
| --- | --- | --- |
| text | <code>string</code> | the test to search for |

<a name="PatientSearchComponent+clickSearchResult"></a>

### patientSearchComponent.clickSearchResult(patient)
Clicks the search result associated with the given patient
Fails the test if the patient is not in the results

**Kind**: instance method of [<code>PatientSearchComponent</code>](#PatientSearchComponent)  

| Param | Type | Description |
| --- | --- | --- |
| patient | <code>object</code> | the patient to click |

<a name="PatientSearchComponent+clearSearch"></a>

### patientSearchComponent.clearSearch()
Clears the search box

**Kind**: instance method of [<code>PatientSearchComponent</code>](#PatientSearchComponent)  
<a name="PatientSearchComponent+seePatientRecord"></a>

### patientSearchComponent.seePatientRecord(patient)
Validates the patient's information is visible

**Kind**: instance method of [<code>PatientSearchComponent</code>](#PatientSearchComponent)  

| Param | Type | Description |
| --- | --- | --- |
| patient | <code>object</code> | info about the patient to validate |

<a name="PatientSearchComponent+dontSeePatientRecord"></a>

### patientSearchComponent.dontSeePatientRecord(patient)
Validates that the patient's info is NOT visible

**Kind**: instance method of [<code>PatientSearchComponent</code>](#PatientSearchComponent)  

| Param | Type | Description |
| --- | --- | --- |
| patient | <code>object</code> | info about the patient to validate is NOT vissible |

<a name="PatientSearchComponent+seeNoResults"></a>

### patientSearchComponent.seeNoResults()
Validates that no results are visible

**Kind**: instance method of [<code>PatientSearchComponent</code>](#PatientSearchComponent)  
<a name="PatientSearchComponent+searchForPatientByIdAndSelect"></a>

### patientSearchComponent.searchForPatientByIdAndSelect(patient)
Searches for the patient by their id, verifies
the search result and then selects the patient

**Kind**: instance method of [<code>PatientSearchComponent</code>](#PatientSearchComponent)  

| Param | Type | Description |
| --- | --- | --- |
| patient | <code>object</code> | info about the patient used to search, verify and select |

<a name="Component+addToPage"></a>

### patientSearchComponent.addToPage(page)
Copy properties from this component to the page.
excluding [I, constructor, create, and addToPage]

**Kind**: instance method of [<code>PatientSearchComponent</code>](#PatientSearchComponent)  

| Param | Type | Description |
| --- | --- | --- |
| page | [<code>Page</code>](#Page) | the page that this component's properties are added to |

<a name="Component+translate"></a>

### patientSearchComponent.translate(key)
Get the translated value associated with the given key

**Kind**: instance method of [<code>PatientSearchComponent</code>](#PatientSearchComponent)  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | the key used to get the translated value |

<a name="TabsComponent"></a>

## TabsComponent
Functions that help interact with pages with tabs

**Kind**: global class  
<a name="TabsComponent+clickTab"></a>

### tabsComponent.clickTab(tabElement)
Clicks the given tab element

**Kind**: instance method of [<code>TabsComponent</code>](#TabsComponent)  

| Param | Type | Description |
| --- | --- | --- |
| tabElement | <code>object</code> | css defining the tab element |

<a name="DashboardPage"></a>

## DashboardPage ⇐ [<code>Page</code>](#Page)
Represetns the main dashbaord page
and includes functionality that facilitates interacting
with the page during tests

**Kind**: global class  
**Extends**: [<code>Page</code>](#Page)  

* [DashboardPage](#DashboardPage) ⇐ [<code>Page</code>](#Page)
    * [.navigateToClinicPage()](#DashboardPage+navigateToClinicPage)
    * [.navigateToLabPage()](#DashboardPage+navigateToLabPage)
    * [.navigateToPharmacyPage()](#DashboardPage+navigateToPharmacyPage)
    * [.navigateToRegistrationPage()](#DashboardPage+navigateToRegistrationPage)
    * [.navigateToReportPage()](#DashboardPage+navigateToReportPage)
    * [.navigateToSocialPage()](#DashboardPage+navigateToSocialPage)
    * [.navigateToVitalsPage()](#DashboardPage+navigateToVitalsPage)
    * [._navigate(button, newPageFile)](#DashboardPage+_navigate)
    * [._init()](#Page+_init)
    * [.isLoaded()](#Page+isLoaded)
    * [._addComponent(componentName)](#Page+_addComponent)
    * [.translate(key)](#Page+translate)

<a name="DashboardPage+navigateToClinicPage"></a>

### dashboardPage.navigateToClinicPage()
Navigates to the clinic page

**Kind**: instance method of [<code>DashboardPage</code>](#DashboardPage)  
<a name="DashboardPage+navigateToLabPage"></a>

### dashboardPage.navigateToLabPage()
Navigates to the lab page

**Kind**: instance method of [<code>DashboardPage</code>](#DashboardPage)  
<a name="DashboardPage+navigateToPharmacyPage"></a>

### dashboardPage.navigateToPharmacyPage()
Navigates to the pharmacy page

**Kind**: instance method of [<code>DashboardPage</code>](#DashboardPage)  
<a name="DashboardPage+navigateToRegistrationPage"></a>

### dashboardPage.navigateToRegistrationPage()
Navigates to the registration page

**Kind**: instance method of [<code>DashboardPage</code>](#DashboardPage)  
<a name="DashboardPage+navigateToReportPage"></a>

### dashboardPage.navigateToReportPage()
Navigates to the report page

**Kind**: instance method of [<code>DashboardPage</code>](#DashboardPage)  
<a name="DashboardPage+navigateToSocialPage"></a>

### dashboardPage.navigateToSocialPage()
Navigates to the social page

**Kind**: instance method of [<code>DashboardPage</code>](#DashboardPage)  
<a name="DashboardPage+navigateToVitalsPage"></a>

### dashboardPage.navigateToVitalsPage()
Navigates to the vitals page

**Kind**: instance method of [<code>DashboardPage</code>](#DashboardPage)  
<a name="DashboardPage+_navigate"></a>

### dashboardPage._navigate(button, newPageFile)
Navigates to an app by clicking the app's button

**Kind**: instance method of [<code>DashboardPage</code>](#DashboardPage)  

| Param | Type | Description |
| --- | --- | --- |
| button | <code>object</code> | css for the button to click |
| newPageFile | <code>string</code> | the name of the new page that opens |

<a name="Page+_init"></a>

### dashboardPage._init()
Initializes the page

**Kind**: instance method of [<code>DashboardPage</code>](#DashboardPage)  
<a name="Page+isLoaded"></a>

### dashboardPage.isLoaded()
Validates that the page is loaded

**Kind**: instance method of [<code>DashboardPage</code>](#DashboardPage)  
<a name="Page+_addComponent"></a>

### dashboardPage._addComponent(componentName)
Gets an instance of the component
and copies its properties and functions
to this page

**Kind**: instance method of [<code>DashboardPage</code>](#DashboardPage)  

| Param | Type | Description |
| --- | --- | --- |
| componentName | <code>string</code> | the name of the component to add |

<a name="Page+translate"></a>

### dashboardPage.translate(key)
Translate using the default locale

**Kind**: instance method of [<code>DashboardPage</code>](#DashboardPage)  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | the key used to get the translated value |

<a name="LoginPage"></a>

## LoginPage ⇐ [<code>Page</code>](#Page)
Represents the login page
and includes functionality that facilitates interacting
with the page during tests

**Kind**: global class  
**Extends**: [<code>Page</code>](#Page)  

* [LoginPage](#LoginPage) ⇐ [<code>Page</code>](#Page)
    * [.login()](#LoginPage+login)
    * [._init()](#Page+_init)
    * [.isLoaded()](#Page+isLoaded)
    * [._addComponent(componentName)](#Page+_addComponent)
    * [.translate(key)](#Page+translate)

<a name="LoginPage+login"></a>

### loginPage.login()
Logs the user in
Unless you are testing this functionality directly
you should not call this function. Instead, call I.login(userInfo)

**Kind**: instance method of [<code>LoginPage</code>](#LoginPage)  

| Param | Type | Description |
| --- | --- | --- |
| userInfo.username | <code>string</code> | username to login with |
| userInfo.password | <code>string</code> | the user's password |

<a name="Page+_init"></a>

### loginPage._init()
Initializes the page

**Kind**: instance method of [<code>LoginPage</code>](#LoginPage)  
<a name="Page+isLoaded"></a>

### loginPage.isLoaded()
Validates that the page is loaded

**Kind**: instance method of [<code>LoginPage</code>](#LoginPage)  
<a name="Page+_addComponent"></a>

### loginPage._addComponent(componentName)
Gets an instance of the component
and copies its properties and functions
to this page

**Kind**: instance method of [<code>LoginPage</code>](#LoginPage)  

| Param | Type | Description |
| --- | --- | --- |
| componentName | <code>string</code> | the name of the component to add |

<a name="Page+translate"></a>

### loginPage.translate(key)
Translate using the default locale

**Kind**: instance method of [<code>LoginPage</code>](#LoginPage)  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | the key used to get the translated value |

<a name="Page"></a>

## Page
Represents a page on the POC website
A page consists of functions that help tests interact with the POC page
and can have multiple components which add common functionality.
Subclasses of Page pass in options that define when the page is loaded
and the names of the page's components, if any.
This class adds the component's properties
to the class instance which lets tests call component methods
on the instance as if they were one object. See Compoent for more details.

**Kind**: global class  

* [Page](#Page)
    * [._init()](#Page+_init)
    * [.isLoaded()](#Page+isLoaded)
    * [._addComponent(componentName)](#Page+_addComponent)
    * [.translate(key)](#Page+translate)

<a name="Page+_init"></a>

### page._init()
Initializes the page

**Kind**: instance method of [<code>Page</code>](#Page)  
<a name="Page+isLoaded"></a>

### page.isLoaded()
Validates that the page is loaded

**Kind**: instance method of [<code>Page</code>](#Page)  
<a name="Page+_addComponent"></a>

### page._addComponent(componentName)
Gets an instance of the component
and copies its properties and functions
to this page

**Kind**: instance method of [<code>Page</code>](#Page)  

| Param | Type | Description |
| --- | --- | --- |
| componentName | <code>string</code> | the name of the component to add |

<a name="Page+translate"></a>

### page.translate(key)
Translate using the default locale

**Kind**: instance method of [<code>Page</code>](#Page)  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | the key used to get the translated value |

<a name="RegisterPatientPage"></a>

## RegisterPatientPage ⇐ [<code>Page</code>](#Page)
Represents the register patint page
and includes functionality that facilitates interacting
with the page during tests

**Kind**: global class  
**Extends**: [<code>Page</code>](#Page)  

* [RegisterPatientPage](#RegisterPatientPage) ⇐ [<code>Page</code>](#Page)
    * [.isLoaded()](#RegisterPatientPage+isLoaded)
    * [.fillIdentifierForm(patient)](#RegisterPatientPage+fillIdentifierForm)
    * [.fillNameForm(patient)](#RegisterPatientPage+fillNameForm)
    * [.selectGender(patient)](#RegisterPatientPage+selectGender)
    * [.fillBirthDateForm(patient)](#RegisterPatientPage+fillBirthDateForm)
    * [.fillContactForm(patient)](#RegisterPatientPage+fillContactForm)
    * [.selectProvenience(patient)](#RegisterPatientPage+selectProvenience)
    * [.fillHIVTestForm(patient)](#RegisterPatientPage+fillHIVTestForm)
    * [.clickNext(seconds)](#RegisterPatientPage+clickNext)
    * [._init()](#Page+_init)
    * [._addComponent(componentName)](#Page+_addComponent)
    * [.translate(key)](#Page+translate)

<a name="RegisterPatientPage+isLoaded"></a>

### registerPatientPage.isLoaded()
Checks to see if the url in chrome is loaded and
checks additional elements on the page

**Kind**: instance method of [<code>RegisterPatientPage</code>](#RegisterPatientPage)  
**Overrides**: [<code>isLoaded</code>](#Page+isLoaded)  
<a name="RegisterPatientPage+fillIdentifierForm"></a>

### registerPatientPage.fillIdentifierForm(patient)
Fill the identifier form with the patient's identifier

**Kind**: instance method of [<code>RegisterPatientPage</code>](#RegisterPatientPage)  

| Param | Type | Description |
| --- | --- | --- |
| patient | <code>object</code> | patient info that contains an identifier to fill the form with |

<a name="RegisterPatientPage+fillNameForm"></a>

### registerPatientPage.fillNameForm(patient)
Fills the name form with the patient first and last name

**Kind**: instance method of [<code>RegisterPatientPage</code>](#RegisterPatientPage)  

| Param | Type | Description |
| --- | --- | --- |
| patient | <code>object</code> | patient info to fill the form with |

<a name="RegisterPatientPage+selectGender"></a>

### registerPatientPage.selectGender(patient)
Selects the appropriate gender based on the given patient info

**Kind**: instance method of [<code>RegisterPatientPage</code>](#RegisterPatientPage)  

| Param | Type | Description |
| --- | --- | --- |
| patient | <code>object</code> | the patient info to select the gender from |

<a name="RegisterPatientPage+fillBirthDateForm"></a>

### registerPatientPage.fillBirthDateForm(patient)
Fills in the birthdate form with the patient's birthdate

**Kind**: instance method of [<code>RegisterPatientPage</code>](#RegisterPatientPage)  

| Param | Type | Description |
| --- | --- | --- |
| patient | <code>object</code> | patient info containing the patient's birthdate |

<a name="RegisterPatientPage+fillContactForm"></a>

### registerPatientPage.fillContactForm(patient)
Fills the contact form with patient info

**Kind**: instance method of [<code>RegisterPatientPage</code>](#RegisterPatientPage)  

| Param | Type | Description |
| --- | --- | --- |
| patient | <code>object</code> | patient info used to fill the form |

<a name="RegisterPatientPage+selectProvenience"></a>

### registerPatientPage.selectProvenience(patient)
Selects the appropriate provenience based on the patients info

**Kind**: instance method of [<code>RegisterPatientPage</code>](#RegisterPatientPage)  

| Param | Type | Description |
| --- | --- | --- |
| patient | <code>object</code> | patient info used to select the provenience |

<a name="RegisterPatientPage+fillHIVTestForm"></a>

### registerPatientPage.fillHIVTestForm(patient)
Fills the HIV form with patient info

**Kind**: instance method of [<code>RegisterPatientPage</code>](#RegisterPatientPage)  

| Param | Type | Description |
| --- | --- | --- |
| patient | <code>object</code> | patient info used to fill the form |

<a name="RegisterPatientPage+clickNext"></a>

### registerPatientPage.clickNext(seconds)
Clicks the next button

**Kind**: instance method of [<code>RegisterPatientPage</code>](#RegisterPatientPage)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| seconds | <code>number</code> | <code>5</code> | the max number of seconds to wait for the oerlay to dissappear |

<a name="Page+_init"></a>

### registerPatientPage._init()
Initializes the page

**Kind**: instance method of [<code>RegisterPatientPage</code>](#RegisterPatientPage)  
<a name="Page+_addComponent"></a>

### registerPatientPage._addComponent(componentName)
Gets an instance of the component
and copies its properties and functions
to this page

**Kind**: instance method of [<code>RegisterPatientPage</code>](#RegisterPatientPage)  

| Param | Type | Description |
| --- | --- | --- |
| componentName | <code>string</code> | the name of the component to add |

<a name="Page+translate"></a>

### registerPatientPage.translate(key)
Translate using the default locale

**Kind**: instance method of [<code>RegisterPatientPage</code>](#RegisterPatientPage)  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | the key used to get the translated value |

<a name="VitalsAdultFormPage"></a>

## VitalsAdultFormPage
Represents the vitals page for adults
and includes functionality that facilitates interacting
with the page during tests

**Kind**: global class  

* [VitalsAdultFormPage](#VitalsAdultFormPage)
    * [.fillForm()](#VitalsAdultFormPage+fillForm)
    * [.clickNext()](#VitalsAdultFormPage+clickNext)
    * [.verifyForm()](#VitalsAdultFormPage+verifyForm)
    * [.clickConfirm()](#VitalsAdultFormPage+clickConfirm)
    * [._initFieldsProperty()](#VitalsAdultFormPage+_initFieldsProperty)

<a name="VitalsAdultFormPage+fillForm"></a>

### vitalsAdultFormPage.fillForm()
Fills the vitals form with data

**Kind**: instance method of [<code>VitalsAdultFormPage</code>](#VitalsAdultFormPage)  

| Param | Type |
| --- | --- |
| data.temperature | <code>number</code> | 
| data.weight | <code>number</code> | 
| data.height | <code>number</code> | 
| data.systolicBloodPressure | <code>number</code> | 
| data.diastolicBloopPressure | <code>number</code> | 
| data.cardiacFrequency | <code>number</code> | 
| data.respiratoryRate | <code>number</code> | 

<a name="VitalsAdultFormPage+clickNext"></a>

### vitalsAdultFormPage.clickNext()
Clicks the next button

**Kind**: instance method of [<code>VitalsAdultFormPage</code>](#VitalsAdultFormPage)  
<a name="VitalsAdultFormPage+verifyForm"></a>

### vitalsAdultFormPage.verifyForm()
Verifies the form data is as expected

**Kind**: instance method of [<code>VitalsAdultFormPage</code>](#VitalsAdultFormPage)  

| Param | Type |
| --- | --- |
| data.temperature | <code>number</code> | 
| data.weight | <code>number</code> | 
| data.height | <code>number</code> | 
| data.systolicBloodPressure | <code>number</code> | 
| data.diastolicBloopPressure | <code>number</code> | 
| data.cardiacFrequency | <code>number</code> | 
| data.respiratoryRate | <code>number</code> | 

<a name="VitalsAdultFormPage+clickConfirm"></a>

### vitalsAdultFormPage.clickConfirm()
Clicks the confirm button

**Kind**: instance method of [<code>VitalsAdultFormPage</code>](#VitalsAdultFormPage)  
<a name="VitalsAdultFormPage+_initFieldsProperty"></a>

### vitalsAdultFormPage._initFieldsProperty()
Initializes the data that is used to find fields in the DOM

**Kind**: instance method of [<code>VitalsAdultFormPage</code>](#VitalsAdultFormPage)  
<a name="ApiManager"></a>

## ApiManager
ApiManager holds on to each Api. An instance of Api manager can be passed
into a test if that test needs to manipulate data on the server
A detaled description of each Api can be foudn at the following urls:
   https://wiki.openmrs.org/display/docs/REST+Web+Service+Resources+in+OpenMRS+1.8#RESTWebServiceResourcesinOpenMRS1.8-User
   https://psbrandt.io/openmrs-contrib-apidocs/

**Kind**: global class  

* [ApiManager](#ApiManager)
    * [.cleanUp()](#ApiManager+cleanUp)
    * [._createApis()](#ApiManager+_createApis)
    * [._onApiCreatedResource(api, createdResource)](#ApiManager+_onApiCreatedResource)
    * [._onApiDeletedResource(api, deletedResource)](#ApiManager+_onApiDeletedResource)

<a name="ApiManager+cleanUp"></a>

### apiManager.cleanUp()
Remove all objects that were created during testing.
This function is called after each tests from hooks.js

**Kind**: instance method of [<code>ApiManager</code>](#ApiManager)  
<a name="ApiManager+_createApis"></a>

### apiManager._createApis()
Create the apis

**Kind**: instance method of [<code>ApiManager</code>](#ApiManager)  
<a name="ApiManager+_onApiCreatedResource"></a>

### apiManager._onApiCreatedResource(api, createdResource)
Callback executed each time an API creates a new resource

**Kind**: instance method of [<code>ApiManager</code>](#ApiManager)  

| Param | Type | Description |
| --- | --- | --- |
| api | <code>Api</code> | the api that created a new resource |
| createdResource | <code>object</code> | the resource that was created |

<a name="ApiManager+_onApiDeletedResource"></a>

### apiManager._onApiDeletedResource(api, deletedResource)
Callback executed each time an API deletes a new resource

**Kind**: instance method of [<code>ApiManager</code>](#ApiManager)  

| Param | Type | Description |
| --- | --- | --- |
| api | <code>Api</code> | the api that deleted a resource |
| deletedResource | <code>object</code> | the deleted resource |

<a name="Translator"></a>

## Translator
This class provides translations for strings based on i18n.

**Kind**: global class  

* [Translator](#Translator)
    * [new Translator()](#new_Translator_new)
    * [.translate(key)](#Translator+translate)

<a name="new_Translator_new"></a>

### new Translator()
Creates a new instance of I18n

**Example**  
```js
const t = require('./../translator')
 t.translate(key)
```
<a name="Translator+translate"></a>

### translator.translate(key)
Translates the given key into an appropriate string.
All keys can be found in /poc_config/openmrs/i18n

**Kind**: instance method of [<code>Translator</code>](#Translator)  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | the key for the translated value |

<a name="login"></a>

## login()
Logs the user in through the login page.
If no user is specified the admin user is used.

**Kind**: global function  

| Type | Description |
| --- | --- |
| <code>object</code> | information about the user that's used to login |

