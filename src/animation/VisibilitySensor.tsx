import * as React from 'react';
import * as uuid from 'uuid';

import VisibilityObserver from './VisibilityObserver';

const DEFAULT_ID = uuid.v4();
// Track UUIDs by the optionally provided root element. If no root element is provided, a single shared UUID will be used.
const elementIds: Map<HTMLElement, string> = new Map();
// Track visibility observer instances by provided options root element, root margin, and threshold. Each unique
// combination these options requires a new visibility observer instance.
const visibilityObservers: Map<string, VisibilityObserver> = new Map();

interface VisibilitySensorProps {
  active: boolean;
  children: React.ReactNode;
  onChange: (isVisible: boolean) => void;
  root: HTMLElement | undefined | null;
  rootMargin: string;
  threshold: number;
}

class VisibilitySensor extends React.Component<VisibilitySensorProps> {
  elementId: string | undefined;
  isVisible: boolean = false;

  static defaultProps = {
    active: true,
    children: React.createElement('span'),
    root: null,
    rootMargin: '0px 0px 0px 0px',
    threshold: [0, Number.MIN_VALUE],
  };

  constructor(props: VisibilitySensorProps) {
    super(props);

    const { root, rootMargin, threshold } = props;

    if (root) {
      if (elementIds.has(root)) {
        this.elementId = elementIds.get(root) || '';
      } else {
        elementIds.set(root, uuid.v4());
      }
    } else {
      this.elementId = DEFAULT_ID;
    }

    const visibilityObserverId = this.getVisibilityObserverId();
    if (!visibilityObservers.has(visibilityObserverId)) {
      visibilityObservers.set(
        visibilityObserverId,
        new VisibilityObserver({ root, rootMargin, threshold })
      );
    }
  }

  componentDidMount() {
    if (this.props.active) {
      const visibilityObserver = this.getVisibilityObserver();
      visibilityObserver.observe(this);
      this.isVisible = visibilityObserver.isVisible(this);
    }
  }

  componentDidUpdate(prevProps: VisibilitySensorProps) {
    const visibilityObserver = this.getVisibilityObserver();
    const isVisible = visibilityObserver.isVisible(this);

    if (this.props.active && isVisible !== this.isVisible) {
      this.props.onChange(isVisible);
    }

    if (!prevProps.active && this.props.active) {
      visibilityObserver.observe(this);
    } else if (prevProps.active && !this.props.active) {
      visibilityObserver.unobserve(this);
    }

    this.isVisible = isVisible;
  }

  componentWillUnmount() {
    this.getVisibilityObserver().unobserve(this);
  }

  getVisibilityObserverId() {
    const { rootMargin, threshold } = this.props;
    return `${this.elementId} ${rootMargin} ${threshold}`;
  }

  getVisibilityObserver(): VisibilityObserver {
    const id = this.getVisibilityObserverId();
    const visibilityObserver = visibilityObservers.get(id);
    if (!visibilityObserver)
      throw new Error(`Visibility sensor with id ${id} not found.`);
    return visibilityObserver;
  }

  render() {
    return React.Children.only(this.props.children);
  }
}

export default VisibilitySensor;
