
import json
import logging
from datetime import datetime

logger = logging.getLogger("pooling_utils")

def serialize_for_db(obj):
    """Convert Python objects to database-friendly formats."""
    if isinstance(obj, datetime):
        return obj.isoformat()
    elif hasattr(obj, '__dict__'):
        return obj.__dict__
    else:
        return str(obj)

def json_serialize(data):
    """Serialize data to JSON with custom handling for complex types."""
    try:
        return json.dumps(data, default=serialize_for_db)
    except Exception as e:
        logger.error(f"JSON serialization error: {e}")
        # Fallback to string representation
        return str(data)

def parse_json_safely(json_str):
    """Safely parse JSON data, returning empty dict on failure."""
    if not json_str:
        return {}
    
    try:
        return json.loads(json_str)
    except Exception as e:
        logger.error(f"JSON parsing error: {e}")
        return {}

def calculate_efficiency_score(volume_ratio, weight_ratio, zone_diversity):
    """Calculate a standardized efficiency score based on multiple factors."""
    # Volume utilization has highest weight
    volume_factor = volume_ratio * 0.6
    
    # Weight utilization is secondary
    weight_factor = weight_ratio * 0.3
    
    # Zone diversity (lower is better)
    zone_penalty = min(zone_diversity, 1.0) * 0.1
    
    return (volume_factor + weight_factor) * (1 - zone_penalty)
