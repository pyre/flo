#-*- coding: utf-8 -*-


# support
import flo


# declaration
class Workflow(flo.shells.command, family="flo.cli.workflow"):
    """
    Base class for command panels that invoke workflows
    """


    # public state
    flow = flo.model.flows.flow()
    flow.doc = "the workflow to execute"


    # create a new generic flow; subclasses can specialize by providing a default value for the
    # flow trait
    @flo.export(tip="create a new instance of the workflow")
    def new(self, plexus, **kwds):
        """
        Persist the current flow in a configuration file
        """
        # get my flow
        flow = self.flow
        # grab a channel
        channel = plexus.info
        # show me
        channel.log(f"creating '{flow.pyre_name}'")
        # if the flow is non-trivial
        if flow is not None:
            # do it
            self.flow.pyre_save()
        # all done
        return 0


    # execute the flow
    @flo.export(tip="execute the flow")
    def run(self, plexus, **kwds):
        """
        Execute the current workflow
        """
        # get my flow
        flow = self.flow
        # grab a channel
        channel = plexus.info
        # show me
        channel.log(f"executing '{self.flow.pyre_spec}'")
        # if the flow is non-trivial
        if flow is not None:
            # do it
            flow.pyre_make()
        # all done
        return 0


    # load a persisted flow and display its layout
    @flo.export(tip="display information about an existing workflow instance")
    def info(self, plexus, **kwds):
        """
        Load a flow from a configuration file and display its layout
        """
        # get my flow
        flow = self.flow
        # grab a channel
        channel = plexus.info
        # show me
        channel.line()
        # if the flow is non-trivial
        if self.flow is not None:
            # show me
            self.flow.pyre_dump(channel=channel, level=0)
        # flush
        channel.log()
        # all done
        return 0


# end of file
