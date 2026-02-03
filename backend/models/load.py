"""
Load types for structural analysis
"""

class Load:
    """Base class for loads"""

    POINT = 'point'
    UDL = 'udl'
    VDL = 'vdl'

    def __init__(self, load_type):
        self.load_type = load_type

    def to_dict(self):
        """Convert load to dictionary"""
        raise NotImplementedError


class PointLoad(Load):
    """Point load (concentrated load)"""

    def __init__(self, position, magnitude):
        """
        Args:
            position (float): Position along beam (m)
            magnitude (float): Load magnitude (kN) - positive downward
        """
        super().__init__(Load.POINT)
        self.position = position
        self.magnitude = magnitude

    def to_dict(self):
        return {
            'type': self.load_type,
            'position': self.position,
            'magnitude': self.magnitude
        }


class UniformlyDistributedLoad(Load):
    """Uniformly Distributed Load (UDL)"""

    def __init__(self, start, end, magnitude):
        """
        Args:
            start (float): Start position (m)
            end (float): End position (m)
            magnitude (float): Load intensity (kN/m) - positive downward
        """
        super().__init__(Load.UDL)
        self.start = start
        self.end = end
        self.magnitude = magnitude

    def to_dict(self):
        return {
            'type': self.load_type,
            'start': self.start,
            'end': self.end,
            'magnitude': self.magnitude
        }


class VaryingDistributedLoad(Load):
    """Varying Distributed Load (VDL) - Triangular or Trapezoidal"""

    def __init__(self, start, end, magnitude_start, magnitude_end):
        """
        Args:
            start (float): Start position (m)
            end (float): End position (m)
            magnitude_start (float): Load intensity at start (kN/m)
            magnitude_end (float): Load intensity at end (kN/m)
        """
        super().__init__(Load.VDL)
        self.start = start
        self.end = end
        self.magnitude_start = magnitude_start
        self.magnitude_end = magnitude_end

    def to_dict(self):
        return {
            'type': self.load_type,
            'start': self.start,
            'end': self.end,
            'magnitude_start': self.magnitude_start,
            'magnitude_end': self.magnitude_end
        }
