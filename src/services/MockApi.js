// Local Storage Keys for state persistence during development
const KEYS = {
  BALANCE: 'anonroom_balance',
  DEPOSITS: 'anonroom_deposits',
  TICKETS: 'anonroom_tickets',
};

// Seed 10 Static Target Destination Wallets for the Rolling Pool Algorithm
const STATIC_WALLET_POOL = [
  "0x71C7656EC7ab88b098defB751B7401B5f6d147a3",
  "0x281055afc982d96cba15544d7f75295b6db0a610",
  "0x3f5ce5fbfe3e9af3971dd833d26ba9b5c936f0be",
  "0xdac17f958d2ee523a2206206994597c13d831ec7",
  "0xfb6916095ca1df60bb79ce92ce3ea74c37c5d359",
  "0x5774a56119ca114a31e627407a51379fa72b781e",
  "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984",
  "0x7a250d5630b4cf539739df2c5dacb4c659f2488d",
  "0xe592427a0d11122c4d2c849d41d08e5e1e122bfa",
  "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c"
];

// Seed Initial Mock Raffles Data Matching Categories
const MOCK_RAFFLES = [
  {
    id: 'raf-1',
    title: 'PlayStation 5 Pro Digital Edition',
    category: 'goodies',
    total_tickets: 500,
    tickets_sold: 342,
    end_time: Date.now() + 1000 * 60 * 45, // 45 minutes from now
    image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500&auto=format&fit=crop&q=60'
  },
  {
    id: 'raf-2',
    title: '5,000 AR Prize Pool Blast',
    category: 'AR',
    total_tickets: 10000,
    tickets_sold: 7420,
    end_time: Date.now() + 1000 * 60 * 60 * 3, // 3 hours from now
    image: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=500&auto=format&fit=crop&q=60'
  },
  {
    id: 'raf-3',
    title: 'Bored Ape Yacht Club Fraction #44',
    category: 'NFTs',
    total_tickets: 2500,
    tickets_sold: 1980,
    end_time: Date.now() + 1000 * 60 * 60 * 24, // 24 hours from now
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=500&auto=format&fit=crop&q=60'
  },
  {
    id: 'raf-4',
    title: '0.1 Wrapped Bitcoin (WBTC)',
    category: 'crypto',
    total_tickets: 5000,
    tickets_sold: 1200,
    end_time: Date.now() + 1000 * 60 * 60 * 12, // 12 hours from now
    image: 'https://images.unsplash.com/photo-1516245834210-c4c142787335?w=500&auto=format&fit=crop&q=60'
  }
];

export const MockAPI = {
  // Simulate network latency delay
  delay: (ms = 400) => new Promise(resolve => setTimeout(resolve, ms)),

  // 1. Get User Profile Metadata & Balance
  async getProfile() {
    await this.delay();
    let balance = localStorage.getItem(KEYS.BALANCE);
    if (balance === null) {
      localStorage.setItem(KEYS.BALANCE, '250.00');
      balance = '250.00';
    }
    return {
      user_id: 'usr-9941',
      username: 'vaibhav_singhal',
      masked_name: 'user 11****67',
      ar_balance: parseFloat(balance),
      dollar_equivalent: parseFloat(balance) * 0.92, // Placeholder conversion metric
      joined_at: '2026-02-14'
    };
  },

  // 2. Fetch Available Raffles
  async getRaffles() {
    await this.delay();
    return MOCK_RAFFLES;
  },

  // 3. Sequential Pool Wallet Locking Allocation Engine
  async requestDepositAddress(amount) {
    await this.delay(600);
    const existingDeposits = JSON.parse(localStorage.getItem(KEYS.DEPOSITS) || '[]');
    
    // Check if user already holds a dynamic lock active
    const activeLock = existingDeposits.find(d => d.status === 'pending' && d.expires_at > Date.now());
    if (activeLock) {
      return activeLock;
    }

    // Identify which addresses out of the 10 core targets are currently locked by pending transactions
    const lockedAddresses = existingDeposits
      .filter(d => d.status === 'pending' && d.expires_at > Date.now())
      .map(d => d.allocated_address);

    // Dynamic Selection Loop: Pick the first open address sequential index link
    let assignedAddress = null;
    for (let i = 0; i < STATIC_WALLET_POOL.length; i++) {
      if (!lockedAddresses.includes(STATIC_WALLET_POOL[i])) {
        assignedAddress = STATIC_WALLET_POOL[i];
        break;
      }
    }

    // System Fallback: If all 10 wallets are active simultaneously, default loop to index 0
    if (!assignedAddress) {
      assignedAddress = STATIC_WALLET_POOL[0];
    }

    const newDepositRecord = {
      id: `dep-${Math.floor(Math.random() * 90000) + 10000}`,
      amount: parseFloat(amount),
      allocated_address: assignedAddress,
      status: 'pending',
      created_at: Date.now(),
      expires_at: Date.now() + 1000 * 60 * 10 // Exact 10 Minutes Lock Timeline
    };

    existingDeposits.push(newDepositRecord);
    localStorage.setItem(KEYS.DEPOSITS, JSON.stringify(existingDeposits));
    return newDepositRecord;
  },

  // 4. Retrieve Complete Deposit Ledger Transaction Records
  async getDepositHistory() {
    await this.delay();
    return JSON.parse(localStorage.getItem(KEYS.DEPOSITS) || '[]');
  },

  // 5. Commit Ticket Entry Purchases
  async purchaseTickets(raffleId, quantity) {
    await this.delay(500);
    let currentBalance = parseFloat(localStorage.getItem(KEYS.BALANCE) || '250.00');
    const totalCost = quantity * 1; // Explicit 1 AR per Ticket structural cost

    if (currentBalance < totalCost) {
      throw new Error('Insufficient AR balance matrix matching requirements');
    }

    // Update Balance Field
    currentBalance -= totalCost;
    localStorage.setItem(KEYS.BALANCE, currentBalance.toFixed(2));

    // Append Entry Record Array Log Entity
    const ticketsDb = JSON.parse(localStorage.getItem(KEYS.TICKETS) || '[]');
    
    // Generate sequential arbitrary numbers for simulation mapping
    const ticketNumbers = Array.from({ length: quantity }, () => Math.floor(Math.random() * 89999) + 10000);

    const newTicketBatch = {
      id: `tkt-${Math.floor(Math.random() * 90000) + 10000}`,
      raffle_id: raffleId,
      quantity_bought: quantity,
      ticket_numbers: ticketNumbers,
      purchased_at: Date.now()
    };

    ticketsDb.push(newTicketBatch);
    localStorage.setItem(KEYS.TICKETS, JSON.stringify(ticketsDb));

    return { success: true, newBalance: currentBalance, batch: newTicketBatch };
  },

  // 6. Fetch User Ticket Inventories
  async getUserTickets() {
    await this.delay();
    return JSON.parse(localStorage.getItem(KEYS.TICKETS) || '[]');
  }
};
