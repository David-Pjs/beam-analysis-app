"""
Support types for structural analysis
"""

class Support:
    """Base class for structural supports"""

    FIXED = 'fixed'
    HINGED = 'hinged'
    ROLLER = 'roller'

    def __init__(self, position, support_type, settlement=0.0):
        """
        Initialize a support

        Args:
            position (float): Position along beam (m)
            support_type (str): Type of support (fixed, hinged, roller)
            settlement (float): Vertical settlement (m) - for sinking supports
        """
        self.position = position
        self.support_type = support_type
        self.settlement = settlement
        self.reaction_vertical = 0.0
        self.reaction_horizontal = 0.0
        self.reaction_moment = 0.0

    def get_degrees_of_freedom(self):
        """
        Returns the degrees of freedom for the support

        Returns:
            dict: {'vertical': bool, 'horizontal': bool, 'rotation': bool}
        """
        if self.support_type == self.FIXED:
            return {'vertical': False, 'horizontal': False, 'rotation': False}
        elif self.support_type == self.HINGED:
            return {'vertical': False, 'horizontal': False, 'rotation': True}
        elif self.support_type == self.ROLLER:
            return {'vertical': False, 'horizontal': True, 'rotation': True}
        else:
            raise ValueError(f"Unknown support type: {self.support_type}")

    def to_dict(self):
        """Convert support to dictionary"""
        return {
            'position': self.position,
            'type': self.support_type,
            'settlement': self.settlement,
            'reactions': {
                'vertical': self.reaction_vertical,
                'horizontal': self.reaction_horizontal,
                'moment': self.reaction_moment
            }
        }
