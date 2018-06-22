const Component = require('./component');

const LOG_TAG = '[TabsComponent]';

class TabsComponent extends Component {
  /** Clicks the given tab element  */
  clickTab(tabElement) {
    this.I.say(`${LOG_TAG} Clicking on tab`);
    this.I.waitForElement(tabElement);
    this.I.click(tabElement);

    this.I.say(`${LOG_TAG} waiting for tab to load`);
    this.I.wait(1);
    this.I.waitForInvisible('#overlay', 5);
    this.I.wait(1);
  }
}

module.exports = TabsComponent;