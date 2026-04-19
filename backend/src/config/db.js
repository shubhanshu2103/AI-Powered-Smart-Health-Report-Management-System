const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

let instance = null;

class Database {
  constructor() {
    this.client = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      { auth: { persistSession: false } }
    );
  }

  static getInstance() {
    if (!instance) instance = new Database();
    return instance;
  }

  from(table) {
    return this.client.from(table);
  }

  async rpc(fn, params) {
    return this.client.rpc(fn, params);
  }
}

module.exports = Database.getInstance();
