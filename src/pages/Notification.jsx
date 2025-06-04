import { useState, useEffect } from 'react';
import Notice from '../components/Notice';

// eslint-disable-next-line react/prop-types
const Notification = ({ accessToken }) => {
  const [notifications, setNotifications] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);       // Số thông báo mỗi trang
  const [totalItems, setTotalItems] = useState(0); // Lưu tổng số notification từ API

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Hàm fetch nhận thêm page làm tham số
  const fetchNotifications = async (page) => {
    if (!accessToken) return;

    try {
      const response = await fetch(
        `/api/v1/user/me/notifications?page=${page}&limit=${itemsPerPage}`,
        {
          method: 'GET',
          headers: {
            'Accept': '*/*',
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = await response.json();
      console.log('API response data:', responseData);

      // Lấy mảng thực sự ở trường data
      const list = Array.isArray(responseData.data) ? responseData.data : [];

      // Lấy tổng số notification server trả về
      const totalFromServer = typeof responseData.total === 'number'
        ? responseData.total
        : 0;

      // Chuyển format từng item giống trước
      const formattedNotifications = list.flatMap((item) =>
        item.details?.map((detail, index) => ({
          id: `${item.id}-${index}`,
          sensorId: item.sensorId || 'unknown',
          type: detail.mode?.toLowerCase() || 'info',
          message: `${detail.type} ${detail.mode || ''}`.trim(),
          time: item.timestamp
            ? formatTimestamp(item.timestamp)
            : new Date().toLocaleString('en-GB'),
        })) || []
      );

      setNotifications(formattedNotifications);
      setTotalItems(totalFromServer);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setNotifications([]);
      setTotalItems(0);
    }
  };

  // Khi accessToken hoặc currentPage thay đổi, gọi lại fetch
  useEffect(() => {
    console.log('Fetch notifications for page', currentPage);
    fetchNotifications(currentPage);
  }, [accessToken, currentPage]);

  // WebSocket vẫn giữ nguyên logic cũ
  useEffect(() => {
    if (!accessToken) return;

    const socket = new WebSocket(
      `wss://smarthomeserver-wdt0.onrender.com/ws/notification?token=${accessToken}`
    );

    socket.onopen = () => console.log('WebSocket connected');
    socket.onmessage = (event) => {
      console.log('WebSocket message:', event.data);
      let parsedData;
      try {
        parsedData = JSON.parse(event.data);
      } catch (error) {
        console.error('Error parsing WebSocket data:', error);
        return;
      }

      // Xử lý message giống cũ, thêm vào đầu array notifications
      if (parsedData.request) {
        setNotifications((prev) => [
          {
            id: `system-${Date.now()}`,
            sensorId: parsedData.sensorID || 'unknown',
            type: 'system',
            message: parsedData.request,
            time: new Date().toLocaleString('en-GB'),
            actions: [
              {
                label: 'Accept',
                onClick: () => {
                  console.log('Accept subscription for user:', parsedData.userID);
                },
                type: 'primary',
              },
              {
                label: 'Decline',
                onClick: () => {
                  console.log('Decline subscription for user:', parsedData.userID);
                },
                type: 'secondary',
              },
            ],
          },
          ...prev,
        ]);
        // Lưu ý: khi có WebSocket mới, totalItems không thay đổi (hoặc bạn có thể +1 nếu muốn).
      } else if (parsedData.details) {
        const newNotifications = parsedData.details.map((detail, index) => ({
          id: `${parsedData.id || Date.now()}-${index}`,
          sensorId: parsedData.sensorId || 'unknown',
          type: detail.mode?.toLowerCase() || 'info',
          message: `${detail.type} ${detail.mode || ''}`.trim(),
          time: parsedData.timestamp
            ? formatTimestamp(parsedData.timestamp)
            : new Date().toLocaleString('en-GB'),
        }));

        setNotifications((prev) => [...newNotifications, ...prev]);
      } else {
        console.warn('Unknown WebSocket format:', parsedData);
      }
    };

    socket.onerror = (error) => console.error('WebSocket error:', error);
    socket.onclose = () => {
      console.log('WebSocket closed, reconnecting in 5s...');
      setTimeout(() => {
        fetchNotifications(currentPage); // Tạm thời gọi lại fetch để đồng bộ nếu cần
      }, 5000);
    };

    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, [accessToken, currentPage]);

  // Tính toán pagination dựa trên totalItems
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Hàm điều hướng trang
  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Lấy trang đang hiển thị để highlight button
  const getDisplayedPages = () => {
    const maxPagesToShow = 4;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );
  };

  return (
    <div className="flex flex-col font-poppins space-y-4 p-4">
      {/* Hiển thị tổng số notification (nếu cần) */}
      <div className="text-gray-300 mb-2">
        Tổng: {totalItems} thông báo — Trang {currentPage} / {totalPages}
      </div>

      {notifications.length === 0 ? (
        <p className="text-gray-500">No notifications available.</p>
      ) : (
        <>
          {notifications.map((notice) => (
            <Notice
              key={notice.id}
              type={notice.type}
              message={notice.message}
              time={notice.time}
              actions={notice.actions}
            />
          ))}

          {/* Phân trang */}
          <div className="flex justify-center space-x-2 mt-4">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded ${
                currentPage === 1
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              Previous
            </button>

            {getDisplayedPages().map((pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => paginate(pageNumber)}
                className={`px-4 py-2 rounded ${
                  currentPage === pageNumber
                    ? 'bg-blue-700 text-white'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                {pageNumber}
              </button>
            ))}

            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded ${
                currentPage === totalPages
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Notification;
