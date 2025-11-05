export const broadcast_event = <T>(event_name: string, data: T) => {
    return new CustomEvent<T>(event_name, {
        detail: data
    })
}