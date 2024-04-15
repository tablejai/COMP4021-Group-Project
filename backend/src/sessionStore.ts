abstract class SessionStore<Tsession = string> {
  sessions!: Map<string, Tsession>;
  abstract findSession(id: string): Tsession | undefined;
  abstract saveSession(id: string, session: Tsession): void;
  abstract findAllSessions(): Array<[string, Tsession]>;
  abstract deleteSession(id: string): void;
}

export class InMemorySessionStore<Tsession> extends SessionStore<Tsession> {
  static instance: InMemorySessionStore<any>;

  private constructor() {
    super();
    this.sessions = new Map();
  }

  public static getInstance(): InMemorySessionStore<any> {
    if (!InMemorySessionStore.instance) {
      InMemorySessionStore.instance = new InMemorySessionStore();
    }
    return InMemorySessionStore.instance;
  }

  findSession(id: string) {
    return this.sessions.get(id);
  }

  saveSession(id: string, session: Tsession) {
    this.sessions.set(id, session);
  }

  findAllSessions() {
    return [...this.sessions.entries()];
  }

  deleteSession(id: string) {
    this.sessions.delete(id);
  }
}
