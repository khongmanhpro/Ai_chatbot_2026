"""
LightRAG Performance Optimizations
Week 1 Implementation - Target: 60-70% performance improvement

Optimizations:
1. Multi-level Caching (Memory + Redis)
2. Smart Reranking (complexity-based)
3. Streaming Responses (instant UX)
4. Database Indices (PostgreSQL HNSW + GIN)

Author: AI Assistant
Date: 2026-01-07
"""

from .multi_level_cache import MultiLevelCache, CachedLightRAG
from .smart_reranking import SmartReranker, QueryClassifier, QueryComplexity
from .streaming_response import StreamingOptimizer

__all__ = [
    "MultiLevelCache",
    "CachedLightRAG",
    "SmartReranker",
    "QueryClassifier",
    "QueryComplexity",
    "StreamingOptimizer",
]
