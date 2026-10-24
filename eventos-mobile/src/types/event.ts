export type Event = {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  image: string;
};
export type User = { id: string; name: string; role: string };
export type Session = { token: string; user: User };
export type Registration = {
  id: string;
  userId: string;
  eventId: string;
  createdAt: string;
  event: Event;
};
