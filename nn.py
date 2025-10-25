from geopy.distance import geodesic

def nearest_neighbor_path(coords):
    path = []
    visited = [False]*len(coords)
    current = 0  # Start from the first point
    path.append(current)
    visited[current] = True

    for _ in range(len(coords)-1):
        nearest = None
        min_dist = float('inf')
        for i, coord in enumerate(coords):
            if not visited[i]:
                dist = geodesic(coords[current], coord).kilometers
                if dist < min_dist:
                    min_dist = dist
                    nearest = i
        path.append(nearest)
        visited[nearest] = True
        current = nearest
    return path

# 10 random coordinates (latitude, longitude) - major cities around the world
coords = [
    (40.7128, -74.0060),   # New York City, USA
    (51.5074, -0.1278),    # London, UK
    (48.8566, 2.3522),     # Paris, France
    (35.6762, 139.6503),   # Tokyo, Japan
    (-33.8688, 151.2093),  # Sydney, Australia
    (19.4326, -99.1332),   # Mexico City, Mexico
    (55.7558, 37.6173),    # Moscow, Russia
    (-23.5505, -46.6333),  # São Paulo, Brazil
    (30.0444, 31.2357),    # Cairo, Egypt
    (28.6139, 77.2090)     # New Delhi, India
]

# Calculate optimal path using nearest neighbor algorithm
optimal_path_indices = nearest_neighbor_path(coords)
optimal_path_coords = [coords[idx] for idx in optimal_path_indices]

print("Optimal path (by nearest neighbor):")
print("-" * 50)
city_names = [
    "New York City", "London", "Paris", "Tokyo", 
    "Sydney", "Mexico City", "Moscow", "São Paulo", 
    "Cairo", "New Delhi"
]

for i, idx in enumerate(optimal_path_indices):
    print(f"Step {i+1}: {city_names[idx]} - {coords[idx]}")

# Calculate total distance
total_distance = 0
for i in range(len(optimal_path_indices) - 1):
    current_idx = optimal_path_indices[i]
    next_idx = optimal_path_indices[i + 1]
    dist = geodesic(coords[current_idx], coords[next_idx]).kilometers
    total_distance += dist
    print(f"  → Distance to next: {dist:.2f} km")

print("-" * 50)
print(f"Total distance traveled: {total_distance:.2f} km")
