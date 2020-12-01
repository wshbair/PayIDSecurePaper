from asynctest import TestCase as AsyncTestCase
from asynctest import mock as async_mock

from aiohttp import web as aio_web

from ....config.injection_context import InjectionContext
from ....connections.models.connection_record import ConnectionRecord
from ....messaging.request_context import RequestContext

from .. import routes as test_module


class TestIntroductionRoutes(AsyncTestCase):
    async def test_introduction_start_no_service(self):
        context = RequestContext(base_context=InjectionContext(enforce_typing=False))

        mock_req = async_mock.MagicMock()
        mock_req.app = {"request_context": context, "outbound_message_router": None}
        mock_req.json = async_mock.CoroutineMock(
            return_value={
                "my_seed": "my_seed",
                "my_did": "my_did",
                "their_seed": "their_seed",
                "their_did": "their_did",
                "their_verkey": "their_verkey",
                "their_endpoint": "their_endpoint",
                "their_role": "their_role",
                "alias": "alias",
            }
        )
        mock_req.match_info = {"id": "dummy"}
        mock_req.query = {
            "target_connection_id": "dummy",
            "message": "Hello",
        }

        with self.assertRaises(test_module.web.HTTPForbidden):
            await test_module.introduction_start(mock_req)

    async def test_introduction_start(self):
        context = RequestContext(base_context=InjectionContext(enforce_typing=False))

        mock_req = async_mock.MagicMock()
        mock_req.app = {"request_context": context, "outbound_message_router": None}
        mock_req.json = async_mock.CoroutineMock(
            return_value={
                "my_seed": "my_seed",
                "my_did": "my_did",
                "their_seed": "their_seed",
                "their_did": "their_did",
                "their_verkey": "their_verkey",
                "their_endpoint": "their_endpoint",
                "their_role": "their_role",
                "alias": "alias",
            }
        )
        mock_req.match_info = {"id": "dummy"}
        mock_req.query = {
            "target_connection_id": "dummy",
            "message": "Hello",
        }

        mock_conn_rec = async_mock.MagicMock()
        mock_conn_rec.serialize = async_mock.MagicMock()

        with async_mock.patch.object(
            context, "inject", async_mock.CoroutineMock()
        ) as mock_ctx_inject, async_mock.patch.object(
            test_module.web, "json_response"
        ) as mock_response:
            mock_ctx_inject.return_value = async_mock.MagicMock(
                start_introduction=async_mock.CoroutineMock()
            )

            await test_module.introduction_start(mock_req)
            mock_ctx_inject.return_value.start_introduction.assert_called_once_with(
                mock_req.match_info["id"],
                mock_req.query["target_connection_id"],
                mock_req.query["message"],
                mock_req.app["outbound_message_router"],
            )
            mock_response.assert_called_once_with({})

    async def test_register(self):
        mock_app = async_mock.MagicMock()
        mock_app.add_routes = async_mock.MagicMock()

        await test_module.register(mock_app)
        mock_app.add_routes.assert_called_once()
