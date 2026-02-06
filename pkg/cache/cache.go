package cache

import (
    "sync"
    "time"
)

// Item is a structure that holds the value and the expiration time.
type Item struct {
    Value      interface{}
    Expiration int64
}

// Cache is a structure that holds the cache items.
type Cache struct {
    mu    sync.RWMutex
    items map[string]Item
}

// NewCache creates a new Cache object.
func NewCache() *Cache {
    return &Cache{items: make(map[string]Item)}
}

// Set adds a new item to the cache with a specified TTL.
func (c *Cache) Set(key string, value interface{}, ttl time.Duration) {
    c.mu.Lock()
    defer c.mu.Unlock()
    c.items[key] = Item{
        Value:      value,
        Expiration: time.Now().Add(ttl).UnixNano(),
    }
}

// Get retrieves an item from the cache. It returns nil if the item does not exist or has expired.
func (c *Cache) Get(key string) interface{} {
    c.mu.RLock()
    defer c.mu.RUnlock()
    item, found := c.items[key]
    if !found || time.Now().UnixNano() > item.Expiration {
        return nil
    }
    return item.Value
}

// Delete removes an item from the cache.
func (c *Cache) Delete(key string) {
    c.mu.Lock()
    defer c.mu.Unlock()
    delete(c.items, key)
}

// Cleanup removes expired items from the cache.
func (c *Cache) Cleanup() {
    c.mu.Lock()
    defer c.mu.Unlock()
    for key, item := range c.items {
        if time.Now().UnixNano() > item.Expiration {
            delete(c.items, key)
        }
    }
}
