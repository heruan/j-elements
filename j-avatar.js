import { PolymerElement } from '../../@polymer/polymer/polymer-element.js';
import { ThemableMixin } from '../../@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import '../../@polymer/iron-icon/iron-icon.js';
import '../../@vaadin/vaadin-lumo-styles/font-icons.js';
import '../../@vaadin/vaadin-lumo-styles/color.js';
import '../../@vaadin/vaadin-lumo-styles/typography.js';
import '../../@vaadin/vaadin-lumo-styles/sizing.js';
import '../../@vaadin/vaadin-lumo-styles/style.js';
import '../../@polymer/polymer/lib/elements/dom-if.js';
import './j-tooltip.js';
import { html } from '../../@polymer/polymer/lib/utils/html-tag.js';
class AvatarElement extends ThemableMixin(PolymerElement) {
  static get template() {
    return html`
    <style>
      :host {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: var(--lumo-size-m);
        height: var(--lumo-size-m);
        border-radius: 50%;
        box-shadow: 0 1px 2px 1px var(--lumo-contrast-10pct), 0 1px 1px 0 var(--lumo-contrast-10pct);
        overflow: hidden;
        flex: none;
        cursor: default;
      }

      :host(:not([image])) {
        background-color: var(--lumo-base-color);
        background-image: linear-gradient(var(--lumo-contrast-40pct), var(--lumo-contrast-50pct));
      }

      /* Ensure proper vertical alignment */
      :host::before {
        content: "\\2003";
        display: inline-block;
        width: 0;
        overflow: hidden;
      }

      [hidden] {
        display: none !important;
      }

      [part="image"] {
        width: 100%;
        height: 100%;
        border-radius: inherit;
      }

      [part="image"] {
        background-size: cover;
        background-color: var(--lumo-base-color);
      }

      [part="abbr"] {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex: auto;
        align-self: stretch;
        font-family: var(--lumo-font-family);
        font-size: var(--lumo-font-size-s);
        color: var(--lumo-base-color);
        text-transform: uppercase;
        line-height: 1;
        font-weight: 500;
      }

      [part="abbr"]:empty::before {
        font-family: lumo-icons;
        font-size: var(--lumo-icon-size-m);
        content: var(--lumo-icons-user);
      }

      :host(:not([image])) [part="image"],
      :host([image]) [part="abbr"] {
        display: none;
      }

      /* Sizes */

      :host([theme~="x-small"]) {
        width: var(--lumo-size-xs);
        height: var(--lumo-size-xs);
      }

      :host([theme~="x-small"]) [part="abbr"] {
        font-size: var(--lumo-font-size-xxs);
      }

      :host([theme~="small"]) {
        width: var(--lumo-size-s);
        height: var(--lumo-size-s);
      }

      :host([theme~="small"]) [part="abbr"] {
        font-size: var(--lumo-font-size-xs);
      }

      :host([theme~="large"]) {
        width: var(--lumo-size-l);
        height: var(--lumo-size-l);
      }

      :host([theme~="large"]) [part="abbr"] {
        font-size: var(--lumo-font-size-m);
      }

      :host([theme~="x-large"]) {
        width: var(--lumo-size-xl);
        height: var(--lumo-size-xl);
      }

      :host([theme~="x-large"]) [part="abbr"] {
        font-size: var(--lumo-font-size-l);
      }

      /* Circle */
      :host([theme~="rect"]) {
        border-radius: var(--lumo-border-radius);
      }
    </style>
    <div part="abbr"></div>
    <div part="image" style="background-image: url([[image]]);"></div>
    <dom-if if="[[_hasTooltip(name, abbr)]]">
      <template>
        <j-tooltip text="[[name]]"></j-tooltip>
      </template>
    </dom-if>
`;
  }

  static get is() {
    return 'j-avatar';
  }

  static get properties() {
    return {
      name: {
        type: String,
        observer: '_updateAbbr'
      },
      abbr: {
        type: String,
        observer: '_updateAbbr'
      },
      image: String,
    }
  }

  _updateAbbr() {
    let abbr = this.abbr;
    if (!abbr && this.name) {
      // Match first character of each word
      abbr = this.name.match(/\b\S/g).join('');
    }
    this.shadowRoot.querySelector('[part="abbr"]').textContent = abbr;
  }

  _hasTooltip(name, abbr) {
    return this.name || this.abbr;
  }
}

customElements.define(AvatarElement.is, AvatarElement);

export { AvatarElement };
export { AvatarGroupElement };

customElements.define(AvatarGroupElement.is, AvatarGroupElement);

class AvatarGroupElement extends ThemableMixin(PolymerElement) {
  static get template() {
    return html`
    <style>
      :host {
        display: inline-flex;
        padding: 2px;
        align-items: center;
      }

      :host ::slotted(j-avatar[theme~="x-small"]:not(:last-child)) {
        margin-right: calc(var(--lumo-size-xs) * -0.25);
      }

      :host ::slotted(j-avatar[theme~="small"]:not(:last-child)) {
        margin-right: calc(var(--lumo-size-s) * -0.25);
      }

      :host ::slotted(j-avatar:not(:last-child)) {
        margin-right: calc(var(--lumo-size-m) * -0.25);
      }

      :host ::slotted(j-avatar[theme~="large"]:not(:last-child)) {
        margin-right: calc(var(--lumo-size-l) * -0.25);
      }

      :host ::slotted(j-avatar[theme~="x-large"]:not(:last-child)) {
        margin-right: calc(var(--lumo-size-xl) * -0.25);
      }
    </style>
    <slot></slot>
`;
  }

  static get is() {
    return 'j-avatar-group';
  }

  static get properties() {
    return {
    }
  }
}
