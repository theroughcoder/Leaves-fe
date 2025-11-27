declare module './events' {
  export interface Event {
    id: number;
    title: string;
    start: Date;
    end: Date;
    // Add more fields as in your events.js file
  }

  const events: Event[];
  export default events;
}
