import { PolymerElement } from '../../@polymer/polymer/polymer-element.js';
import { ThemableMixin } from '../../vaadin-themable-mixin/vaadin-themable-mixin.js';
import '../../vaadin-overlay/vaadin-overlay.js';
import '../../vaadin-lumo-styles/color.js';
import '../../vaadin-lumo-styles/typography.js';
import '../../vaadin-lumo-styles/style.js';
import { html } from '../../@polymer/polymer/lib/utils/html-tag.js';
import { Templatize } from '../../@polymer/polymer/lib/utils/templatize.js';
import { OverlayElement } from '../../vaadin-overlay/src/vaadin-overlay.js';
const $_documentContainer = document.createElement('template');
$_documentContainer.setAttribute('style', 'display: none;');

$_documentContainer.innerHTML = `<dom-module id="j-tooltip-overlay-styles" theme-for="j-tooltip-overlay">
  <template>
    <style>
      [part="overlay"] {
        pointer-events: none;
        box-shadow: var(--lumo-box-shadow-s);
        background-color: var(--lumo-contrast-80pct);
        color: var(--lumo-base-color);
        border-radius: var(--lumo-border-radius);
        font-size: var(--lumo-font-size-s);
        line-height: var(--lumo-font-size-s);
        font-family: var(--lumo-font-family);
        text-transform: none;
        letter-spacing: 0;
        padding: 0.3em;
        /* Shift so the cursor doesn't block it */
        margin-left: 10px;
      }
    </style>
  </template>
</dom-module>`;

document.head.appendChild($_documentContainer.content);
class TooltipElement extends ThemableMixin(PolymerElement) {
  static get template() {
    return html`
    <style>
      :host {
        display: none;
      }
    </style>
    <slot><template>[[text]]</template></slot>
    <j-tooltip-overlay modeless=""></j-tooltip-overlay>
`;
  }

  static get is() {
    return 'j-tooltip';
  }

  static get properties() {
    return {
      text: String,
      opened: {
        type: Boolean,
        value: false,
        notify: true,
        observer: '_openedChanged'
      }
    }
  }

  ready() {
    super.ready();
    this._overlay = this.shadowRoot.querySelector('j-tooltip-overlay');
    this._overlay.style = 'align-items: flex-start; justify-content: flex-start;';
  }

  _mouseMoveListener(e) {
    if (this._overlay.opened) {
      return;
    }
    this._coords = { top: e.clientY, left: e.clientX };
    if (this._openTimeout) {
      clearTimeout(this._openTimeout);
    }
    this._openTimeout = setTimeout(() => {
      this.opened = true;
      this._overlay.style.top = this._coords.top + 'px';
      this._overlay.style.left = this._coords.left + 'px';
    }, 800);
  }

  _mouseOutListener(e) {
    if (this._openTimeout) {
      clearTimeout(this._openTimeout);
    }
    this.opened = false;
  }

  connectedCallback() {
    super.connectedCallback();

    // Use the parent as the context for this tooltip
    this.parentNode.addEventListener('mousemove', this._mouseMoveListener.bind(this));
    this.parentNode.addEventListener('mouseout', this._mouseOutListener.bind(this));
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    // TODO these function references probably don't match (because of bind(this) in the above)
    this.parentNode.removeEventListener('mousemove', this._mouseMoveListener);
    this.parentNode.removeEventListener('mouseout', this._mouseOutListener);
  }

  _openedChanged(opened) {
    if (opened && !this._instance) {
      this._contentTemplate = this.shadowRoot.querySelector('slot').assignedNodes({flatten: true}).filter(el => {
        if (el.nodeName == 'TEMPLATE') return el;
      })[0];
      if (!this._contentTemplate || this._contentTemplate.nodeName != 'TEMPLATE') {
        return;
      }
      const Templatizer = Templatize.templatize(this._contentTemplate, this, {
        instanceProps: {
          detail: true,
          target: true
        },
        forwardHostProp: function(prop, value) {
          if (this._instance) {
            this._instance.forwardHostProp(prop, value);
          }
        }
      });
      this._instance = new Templatizer({});
      this._overlay.content = this._instance.root;
    }
    if (this._overlay) {
      this._overlay.opened = opened;
    }
  }
}
customElements.define(TooltipElement.is, TooltipElement);

export { TooltipElement };

class TooltipOverlayElement extends OverlayElement {
  static get is() {
    return 'j-tooltip-overlay';
  }
}
customElements.define(TooltipOverlayElement.is, TooltipOverlayElement);
