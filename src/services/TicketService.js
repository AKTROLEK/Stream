import Ticket from '../models/Ticket.js';

class TicketService {
  async createTicket(userId, username, type, data) {
    const ticketCount = await Ticket.countDocuments();
    const ticketId = `TICKET-${String(ticketCount + 1).padStart(5, '0')}`;
    
    const ticket = await Ticket.create({
      ticketId,
      userId,
      username,
      type,
      title: data.title,
      description: data.description,
      applicationData: data.applicationData,
      channelId: data.channelId,
      status: 'open'
    });
    
    return ticket;
  }
  
  async getTicket(ticketId) {
    return await Ticket.findOne({ ticketId });
  }
  
  async getUserTickets(userId) {
    return await Ticket.find({ userId }).sort({ createdAt: -1 });
  }
  
  async getOpenTickets(type = null) {
    const query = { status: 'open' };
    if (type) query.type = type;
    return await Ticket.find(query).sort({ createdAt: -1 });
  }
  
  async addMessage(ticketId, userId, username, content, isStaff = false) {
    const ticket = await Ticket.findOne({ ticketId });
    if (!ticket) throw new Error('Ticket not found');
    
    ticket.messages.push({
      userId,
      username,
      content,
      timestamp: new Date(),
      isStaff
    });
    
    await ticket.save();
    return ticket;
  }
  
  async assignTicket(ticketId, staffId) {
    const ticket = await Ticket.findOne({ ticketId });
    if (!ticket) throw new Error('Ticket not found');
    
    ticket.assignedTo = staffId;
    ticket.status = 'in_progress';
    await ticket.save();
    
    return ticket;
  }
  
  async closeTicket(ticketId, closedBy, reason) {
    const ticket = await Ticket.findOne({ ticketId });
    if (!ticket) throw new Error('Ticket not found');
    
    ticket.status = 'closed';
    ticket.closedAt = new Date();
    ticket.closedBy = closedBy;
    ticket.closeReason = reason;
    
    await ticket.save();
    return ticket;
  }
  
  async updatePriority(ticketId, priority) {
    const ticket = await Ticket.findOne({ ticketId });
    if (!ticket) throw new Error('Ticket not found');
    
    ticket.priority = priority;
    await ticket.save();
    
    return ticket;
  }
}

export default new TicketService();
