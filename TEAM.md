# Сдача вдвоём через GitHub

Локальный комплект уже содержит ветки main и develop и историю подготовки проекта от имени Codex. Для зачёта работы обоих участников каждый делает содержательную правку, проверяет её и отправляет свой коммит со своего аккаунта. Авторство исходных коммитов сохраните.

## 1. Первый участник публикует ветки

Создайте на GitHub пустой репозиторий без README, лицензии и .gitignore. В Settings → Collaborators пригласите аккаунт второго участника с правом записи. Второй участник принимает приглашение. В PowerShell из распакованного каталога проекта:

```powershell
$repo = Read-Host "HTTPS-адрес нового репозитория"
git branch --show-current
git remote add origin $repo
git push -u origin main
git push -u origin develop
```

При запросе Git Credential Manager войдите как Первый участник. На GitHub в Settings → General → Default branch проверьте, что основной выбрана main. Для просмотра результата и сдачи выберите develop.

## 2. Первый участник проверяет внешний каталог и фиксирует свой результат

На своём компьютере используйте имя и адрес из настроек **своего** аккаунта GitHub (подходит указанный там точный noreply-адрес). user.email определяет привязку автора, а вход при push определяет аккаунт, отправляющий изменения.

```powershell
git switch develop
git pull --ff-only origin develop
git config --local user.name (Read-Host "Ваше имя для коммита")
$email = Read-Host "Ваш подтверждённый email или noreply с GitHub"
git config --local user.email $email
```

Проверьте внешний каталог с токеном и без него. Создайте `TMDB-CHECK.md` и запишите фактические результаты: запрос, название найденной карточки, результат импорта и поведение после отключения сети. Если токена нет, зафиксируйте только реально проверенные сценарии резервного режима. При необходимости исправьте выявленную ошибку отдельным коммитом. Перед отправкой документа:

```powershell
git add TMDB-CHECK.md
git diff --cached
git commit -m "test: document TMDB catalog checks"
git push origin develop
```

Сообщите второму участнику, когда push завершится.

## 3. Второй участник проверяет отзывы в отдельном клоне

На своём компьютере войдите в GitHub под своим аккаунтом. Затем:

```powershell
$repo = Read-Host "HTTPS-адрес общего репозитория"
git clone --branch develop $repo kinoteka
cd kinoteka
git config --local user.name (Read-Host "Ваше имя для коммита")
$email = Read-Host "Ваш подтверждённый email или noreply с GitHub"
git config --local user.email $email
npm ci
npm run dev
```

Проверьте создание и редактирование фильма, добавление отзывов с двух аккаунтов, ограничение изменения чужого отзыва и каскадное удаление. В `REVIEWS-CHECK.md` запишите реальные результаты по каждому сценарию. Остановите сервер Ctrl+C. Добавьте только документ:

```powershell
git pull --ff-only origin develop
git add REVIEWS-CHECK.md
git diff --cached
git commit -m "test: verify reviews and movie editing with two accounts"
git push origin develop
```

Для работы на одном компьютере используйте отдельные клоны и отдельные профили ОС либо переключите аккаунт в Git Credential Manager перед push. Одно изменение user.name не переключает авторизацию. Если удалённая ветка опередила вас после локального коммита, сохраните локальную рабочую базу, работайте из чистого рабочего дерева, выполните `git pull --rebase origin develop`, проверьте результат и повторите обычный push. Разные файлы проверки и последовательная отправка сводят вероятность конфликта к минимуму.

## 4. Проверка перед сдачей

```sh
git fetch origin
git rev-list --count origin/develop
git log origin/develop --format="%h %an <%ae> %s"
git ls-tree -r --name-only origin/develop
```

На GitHub откройте Commits для develop. Проверьте, что последние два учебных коммита ведут в профили двух студентов. В файлах должна быть маленькая исходная prisma/dev.db и .env.example. Руководителю передайте ссылку вида `https://github.com/ВЛАДЕЛЕЦ/РЕПОЗИТОРИЙ/tree/develop`. В дневник внесите фактические даты, часы, результаты и ссылки на собственные коммиты.
