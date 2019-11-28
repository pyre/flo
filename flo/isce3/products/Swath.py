#-*- coding: utf-8 -*-


# support
import isce3


# wrapper over the libisce object
class Swath(isce3.libisce.pySwath):
    """
    An acquisition swath

    We should be able to do better so users don't have to hunt down the C++ manual to figure
    out what this is
    """


# end of file
