export type EventData = {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  image: string;
};

export type User = { id: string; name: string; role: string };

export type EventFormData = Omit<EventData, "id">;
