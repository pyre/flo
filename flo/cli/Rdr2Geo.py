#-*- coding: utf-8 -*-


# support
import flo
# superclass
from .Workflow import Workflow


# declaration
class Rdr2Geo(Workflow, family="flo.cli.rdr2geo"):
    """
    Invoke the {rdr2geo} workflow to compute the transformation from radar coordinates to
    geodetic coordinates for a given SLC
    """


    # public state
    flow = flo.model.flows.flow()
    flow.default = flo.isce3.workflows.rdr2geo # by default, make the one named after me...
    flow.doc = "the workflow to execute"



# end of file
