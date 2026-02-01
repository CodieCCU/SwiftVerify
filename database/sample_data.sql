-- Sample data for testing the landlord dashboard and reapplication features
-- This script should be run after schema.sql

-- Insert sample landlord
INSERT INTO landlords (username, email, company_name, password_hash) VALUES
('landlord1', 'landlord1@example.com', 'Sample Properties LLC', '$2a$10$samplehash1234567890'),
('landlord2', 'landlord2@example.com', 'City Rentals Inc', '$2a$10$samplehash1234567890');

-- Insert sample properties
INSERT INTO properties (landlord_id, name, address) VALUES
(1, 'Sunset Apartments', '123 Sunset Blvd, Boise, ID 83702'),
(1, 'Downtown Lofts', '456 Main Street, Boise, ID 83702'),
(2, 'River View Complex', '789 River Road, Boise, ID 83703');

-- Insert sample units
INSERT INTO units (property_id, unit_number, rent_amount, utilities_cost, bedrooms, bathrooms, status) VALUES
-- Sunset Apartments
(1, '101', 1200.00, 150.00, 2, 1.0, 'available'),
(1, '102', 1350.00, 150.00, 2, 1.5, 'available'),
(1, '201', 1500.00, 175.00, 3, 2.0, 'available'),
(1, '202', 1100.00, 125.00, 1, 1.0, 'occupied'),
-- Downtown Lofts
(2, 'A1', 1800.00, 200.00, 2, 2.0, 'available'),
(2, 'A2', 2000.00, 200.00, 3, 2.0, 'available'),
(2, 'B1', 1600.00, 175.00, 2, 1.5, 'available'),
-- River View Complex
(3, '1A', 1400.00, 160.00, 2, 2.0, 'available'),
(3, '2A', 1650.00, 180.00, 3, 2.0, 'available');

-- Insert sample users (tenants)
INSERT INTO users (username, email) VALUES
('john_doe', 'john.doe@example.com'),
('jane_smith', 'jane.smith@example.com'),
('bob_johnson', 'bob.johnson@example.com'),
('alice_williams', 'alice.williams@example.com');

-- Insert sample applications
INSERT INTO applications (user_id, unit_id, status, email, drivers_license_number_encrypted, ssn_encrypted, current_address_encrypted) VALUES
-- Approved applications
(1, 1, 'approved', 'john.doe@example.com', 'encrypted:DL123456', 'encrypted:123-45-6789', 'encrypted:100 Oak St, Boise, ID'),
(2, 5, 'approved', 'jane.smith@example.com', 'encrypted:DL789012', 'encrypted:987-65-4321', 'encrypted:200 Pine Ave, Boise, ID'),
-- Denied applications
(3, 2, 'denied', 'bob.johnson@example.com', 'encrypted:DL345678', 'encrypted:111-22-3333', 'encrypted:300 Elm St, Boise, ID'),
(4, 3, 'denied', 'alice.williams@example.com', 'encrypted:DL901234', 'encrypted:444-55-6666', 'encrypted:400 Maple Dr, Boise, ID'),
-- Pending applications
(1, 6, 'pending', 'john.doe@example.com', 'encrypted:DL567890', 'encrypted:777-88-9999', 'encrypted:100 Oak St, Boise, ID'),
(2, 7, 'pending', 'jane.smith@example.com', 'encrypted:DL234567', 'encrypted:222-33-4444', 'encrypted:200 Pine Ave, Boise, ID');

-- Insert sample reapplication tokens (for testing)
INSERT INTO reapplication_tokens (token, landlord_id, unit_id, tenant_email, expires_at, is_used) VALUES
-- Active token for Bob Johnson (denied applicant)
('sample-token-abc123-active-not-used-12345678901234567890', 1, 2, 'bob.johnson@example.com', NOW() + INTERVAL '7 days', false),
-- Expired token (for testing expiration)
('sample-token-def456-expired-token-12345678901234567890', 1, 3, 'alice.williams@example.com', NOW() - INTERVAL '1 day', false),
-- Used token (for testing one-time use)
('sample-token-ghi789-already-used-12345678901234567890', 1, 1, 'john.doe@example.com', NOW() + INTERVAL '7 days', true);

-- Insert sample activity logs
INSERT INTO activity_logs (entity_type, entity_id, action, actor_type, actor_id, metadata, ip_address) VALUES
('token', 1, 'generated', 'landlord', 1, '{"unit_id": 2, "tenant_email": "bob.johnson@example.com"}', '192.168.1.100'),
('application', 1, 'submitted', NULL, NULL, '{"unit_id": 1, "via_token": false}', '192.168.1.101'),
('application', 2, 'submitted', NULL, NULL, '{"unit_id": 5, "via_token": false}', '192.168.1.102'),
('application', 3, 'submitted', NULL, NULL, '{"unit_id": 2, "via_token": false}', '192.168.1.103'),
('application', 4, 'submitted', NULL, NULL, '{"unit_id": 3, "via_token": false}', '192.168.1.104');
