# Measuring Weak Ties at Scale with Patent Data

*January 20, 2026*

Granovetter's theory of "weak ties" is fundamental to social network analysis, but measuring it at the scale of a national economy has always been difficult. Until now.

## The Data methodology
By geocoding 2 million+ patent records and disambiguating inventor names, we can track the physical movement of knowledge workers across NUTS3 regions in Europe.

### The Algorithm
We define a "weak tie" event as a move between two previously unconnected clusters of co-inventors.
```python
def is_weak_tie(inventor, cluster_a, cluster_b):
    if inventor.moves(cluster_a, cluster_b) and weight(cluster_a, cluster_b) < threshold:
        return True
    return False
```

## Preliminary Results
Our initial maps reveal "invisible bridges"—towns that act as critical connectors between major hubs, despite having low startup density themselves. These "connector regions" are undervalued key players in the national innovation system.
