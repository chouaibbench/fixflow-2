// @ts-nocheck
// Type definitions as JSDoc comments for reference

/**
 * @typedef {'low' | 'medium' | 'high' | 'critical'} Priority
 * @typedef {'pending' | 'in-progress' | 'resolved'} Status
 * @typedef {'admin' | 'technician' | 'worker'} UserRole
 */

/**
 * @typedef {Object} Machine
 * @property {string} id
 * @property {string} name
 * @property {string} location
 * @property {any} [lastMaintenance]
 */

/**
 * @typedef {Object} Ticket
 * @property {string} id
 * @property {string} machineId
 * @property {string} machineName
 * @property {string} description
 * @property {Priority} priority
 * @property {Status} status
 * @property {string} reportedBy
 * @property {string} reportedByEmail
 * @property {string} [assignedTo]
 * @property {any} createdAt
 * @property {any} updatedAt
 * @property {string} [photoUrl]
 */

/**
 * @typedef {Object} UserProfile
 * @property {string} uid
 * @property {string} email
 * @property {UserRole} role
 * @property {string} [displayName]
 */
