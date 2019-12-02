#-*- coding: utf-8 -*-

# support
import flo


# the flow
class Resamp(flo.flow.workflow, family="isce3.workflows.resamp"):
    """
    Resample an SLC
    """


    # flow assets
    # the main engine
    resamp = flo.model.factories.resamp()
    resamp.doc = "the factory that resample SLCs"

    # sources of input
    slcReader = flo.model.readers.slc()
    slcReader.doc = "the reader of native SLCs"


    # flow hooks
    @flo.export
    def pyre_make(self, **kwds):
        """
        Execute the workflow
        """
        # show me
        print(f"{self.pyre_spec}")
        # N.B.: this will be automated eventually
        # get the SLC reader to create the SLC
        self.slcReader.pyre_run(**kwds)
        # and resample it
        self.resamp.pyre_run(**kwds)
        # all done
        return


    # meta-methods
    def __init__(self, **kwds):
        # chain up
        super().__init__(**kwds)

        # unpack
        resamp = self.resamp
        slcReader = self.slcReader

        # bind
        resamp.slc = slcReader.slc

        # all done
        return


# end of file
