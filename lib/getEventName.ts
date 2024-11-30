export function getEventName(eventName: string, variables: { [key: string]: string }) {
  for (let key in variables) {
    eventName = eventName.replace(key, variables[key as any]);
  };

  return eventName
}