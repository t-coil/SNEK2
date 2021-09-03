import {findDOMNode} from 'react-dom';

import type React from 'react';

const defaultOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.5,
};

export default class VisibilityObserver {
  _observer: IntersectionObserver | undefined | null;
  _options: IntersectionObserverInit;
  _nodes: WeakMap<Element, React.Component<any, any>> = new WeakMap();
  _components: WeakMap<React.Component<any, any>, HTMLElement> = new WeakMap();
  _visibleComponents: WeakSet<React.Component<any, any>> = new WeakSet();

  constructor(options: IntersectionObserverInit = defaultOptions) {
    this._options = options;

    if (window.IntersectionObserver != null) {
      this._observer = new window.IntersectionObserver(this._handleEntries, options);
    }
  }

  _handleEntries = (entries: Array<IntersectionObserverEntry>) => {
    entries.forEach((entry) => {
      let visible: boolean;
      if (entry.isIntersecting != null) {
        visible = entry.isIntersecting;
      } else {
        const {threshold} = this._options;
        if (threshold == null) {
          visible = entry.intersectionRatio > 0;
        } else if (!Array.isArray(threshold)) {
          visible = entry.intersectionRatio > threshold;
        } else {
          visible = threshold.some((threshold) => entry.intersectionRatio > threshold);
        }
      }

      const component = this._nodes.get(entry.target);
      if (component != null) {
        let forceUpdate = false;
        if (visible) {
          if (!this._visibleComponents.has(component)) {
            this._visibleComponents.add(component);
            forceUpdate = true;
          }
        } else {
          if (this._visibleComponents.has(component)) {
            this._visibleComponents.delete(component);
            forceUpdate = true;
          }
        }
        if (forceUpdate) {
          component.forceUpdate();
        }
      }
    });
  };

  isVisible(component: React.Component<any, any>): boolean {
    return this._observer != null ? this._visibleComponents.has(component) : true;
  }

  observe(component: React.Component<any, any>) {
    const observer = this._observer;
    if (observer == null) {
      return;
    }

    this.unobserve(component);

    const node = findDOMNode(component);
    if (node instanceof HTMLElement) {
      this._nodes.set(node, component);
      this._components.set(component, node);
      observer.observe(node);
    }
  }

  unobserve(component: React.Component<any, any>) {
    const observer = this._observer;
    if (observer == null) {
      return;
    }

    const node = this._components.get(component);
    if (node != null) {
      this._nodes.delete(node);
      this._components.delete(component);
      this._visibleComponents.delete(component);
      observer.unobserve(node);
    }
  }
}
