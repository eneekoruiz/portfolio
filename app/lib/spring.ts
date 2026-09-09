/** Continuous state: changing a target never discards momentum. */
export class SpringValue {
  value: number;
  target: number;
  velocity = 0;

  constructor(
    value = 0,
    public stiffness = 220,
    public damping = 26,
  ) {
    this.value = value;
    this.target = value;
  }

  step(seconds: number) {
    // Analytic damped spring: long frames advance real elapsed time without
    // unstable integration or making the UI crawl after a suspended frame.
    const dt = Math.min(Math.max(seconds, 0), 2);
    const displacement = this.value - this.target;
    const decay = this.damping / 2;
    const discriminant = decay * decay - this.stiffness;
    if (Math.abs(discriminant) < 0.0001) {
      const b = this.velocity + decay * displacement;
      const envelope = Math.exp(-decay * dt);
      this.value = this.target + (displacement + b * dt) * envelope;
      this.velocity = (b - decay * (displacement + b * dt)) * envelope;
    } else if (discriminant < 0) {
      const frequency = Math.sqrt(-discriminant);
      const b = (this.velocity + decay * displacement) / frequency;
      const cosine = Math.cos(frequency * dt);
      const sine = Math.sin(frequency * dt);
      const envelope = Math.exp(-decay * dt);
      const position = displacement * cosine + b * sine;
      this.value = this.target + position * envelope;
      this.velocity =
        (frequency * (b * cosine - displacement * sine) - decay * position) *
        envelope;
    } else {
      const root = Math.sqrt(discriminant);
      const r1 = -decay + root;
      const r2 = -decay - root;
      const a = (this.velocity - r2 * displacement) / (r1 - r2);
      const b = displacement - a;
      const e1 = Math.exp(r1 * dt);
      const e2 = Math.exp(r2 * dt);
      this.value = this.target + a * e1 + b * e2;
      this.velocity = a * r1 * e1 + b * r2 * e2;
    }
    if (this.settled) this.snap(this.target);
    return this.value;
  }

  get settled() {
    return (
      Math.abs(this.target - this.value) < 0.0005 &&
      Math.abs(this.velocity) < 0.0005
    );
  }

  snap(value: number) {
    this.value = this.target = value;
    this.velocity = 0;
  }
}
