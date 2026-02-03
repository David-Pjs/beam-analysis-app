"""
Beam model for structural analysis
"""

class Beam:
    """Beam structure"""

    def __init__(self, length, E=200e6, I=1.0):
        """
        Initialize a beam

        Args:
            length (float): Total length of beam (m)
            E (float): Elastic modulus (kN/m²) - default 200 GPa for steel
            I (float): Moment of inertia (m⁴)
        """
        self.length = length
        self.E = E  # Elastic modulus
        self.I = I  # Moment of inertia
        self.supports = []
        self.loads = []
        self.results = None

    def add_support(self, support):
        """Add a support to the beam"""
        self.supports.append(support)
        # Sort supports by position
        self.supports.sort(key=lambda s: s.position)

    def add_load(self, load):
        """Add a load to the beam"""
        self.loads.append(load)

    def get_spans(self):
        """
        Get beam spans between supports

        Returns:
            list: List of tuples (start, end) for each span
        """
        if len(self.supports) < 2:
            return [(0, self.length)]

        spans = []
        support_positions = sorted([s.position for s in self.supports])

        for i in range(len(support_positions) - 1):
            spans.append((support_positions[i], support_positions[i + 1]))

        return spans

    def to_dict(self):
        """Convert beam to dictionary"""
        return {
            'length': self.length,
            'E': self.E,
            'I': self.I,
            'supports': [s.to_dict() for s in self.supports],
            'loads': [l.to_dict() for l in self.loads],
            'spans': self.get_spans()
        }
